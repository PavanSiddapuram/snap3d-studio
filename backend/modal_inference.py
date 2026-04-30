import modal

# Weights live in a persistent Modal Volume — downloaded once (~18 GB), reused forever.
weights_volume = modal.Volume.from_name("trellis2-weights", create_if_missing=True)

_image = (
    modal.Image.debian_slim(python_version="3.11")
    .run_commands(
        "pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124",
        "pip install trellis2 o_voxel cumesh rembg pillow",
    )
)

app = modal.App("snap3d-inference")


@app.function(
    image=_image,
    gpu=modal.gpu.A10G(),
    volumes={"/weights": weights_volume},
    timeout=120,
    retries=modal.Retries(max_retries=2, backoff_coefficient=1.0),
    scaledown_window=60,  # stay warm 60 s after last call; scales to zero otherwise
)
def generate_3d(image_bytes: bytes, resolution: int = 1024, poly_budget: str = "medium") -> dict:
    """
    Run Trellis2 image-to-3D on an A10G GPU.
    Returns {"glb_bytes": bytes, "vertices": int, "triangles": int}.
    """
    import io

    import o_voxel
    import torch
    from PIL import Image
    from trellis2.pipelines import Trellis2ImageTo3DPipeline

    # Pipeline is cached in the container between calls (warm start).
    if not hasattr(generate_3d, "_pipeline"):
        generate_3d._pipeline = Trellis2ImageTo3DPipeline.from_pretrained(
            "/weights/TRELLIS.2-4B"
        )
        generate_3d._pipeline.cuda()

    img = Image.open(io.BytesIO(image_bytes))
    poly_targets = {"high": 2_000_000, "medium": 500_000, "low": 150_000}

    with torch.cuda.amp.autocast():
        mesh = generate_3d._pipeline.run(img, resolution=resolution)[0]
        mesh.simplify(poly_targets[poly_budget])

    glb = o_voxel.postprocess.to_glb(
        vertices=mesh.vertices,
        faces=mesh.faces,
        attr_volume=mesh.attrs,
        coords=mesh.coords,
        attr_layout=mesh.layout,
        voxel_size=mesh.voxel_size,
        aabb=[[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]],
        decimation_target=poly_targets[poly_budget],
        texture_size=4096,
        remesh=True,
        verbose=False,
    )
    glb_bytes = glb.export(extension_webp=True)
    return {
        "glb_bytes": glb_bytes,
        "vertices": len(mesh.vertices),
        "triangles": len(mesh.faces),
    }
