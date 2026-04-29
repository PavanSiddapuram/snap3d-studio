import io
from PIL import Image
from rembg import remove


def remove_background_and_resize(image_bytes: bytes, size: int = 1024) -> bytes:
    removed = remove(image_bytes)
    img = Image.open(io.BytesIO(removed)).convert("RGBA")

    # Center-pad to square
    max_dim = max(img.size)
    canvas = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    canvas.paste(img, ((max_dim - img.width) // 2, (max_dim - img.height) // 2))
    canvas = canvas.resize((size, size), Image.LANCZOS)

    buf = io.BytesIO()
    canvas.save(buf, format="PNG")
    return buf.getvalue()
