import subprocess
import tempfile
import os


def run_openscad(scad_code: str, output_format: str = "stl") -> bytes:
    with tempfile.TemporaryDirectory() as tmpdir:
        scad_path = os.path.join(tmpdir, "model.scad")
        out_path = os.path.join(tmpdir, f"model.{output_format}")
        with open(scad_path, "w") as f:
            f.write(scad_code)
        result = subprocess.run(
            ["openscad", "-o", out_path, scad_path],
            capture_output=True,
            timeout=30,
        )
        if result.returncode != 0:
            raise ValueError(f"OpenSCAD error: {result.stderr.decode()}")
        with open(out_path, "rb") as f:
            return f.read()


def generate_3d_text(text: str, font: str, depth_mm: float) -> bytes:
    scad = f'linear_extrude(height={depth_mm})\n  text("{text}", font="{font}", size=20, halign="center", valign="center");'
    return run_openscad(scad)


def generate_vase(profile: str, twist: float, height: float, wall: float) -> bytes:
    scad = f"""
difference() {{
  rotate_extrude(angle=360, $fn=120)
    translate([{wall/2}, 0, 0])
      scale([1, {height}/100, 1])
        circle(r={wall}, $fn=32);
}}
"""
    return run_openscad(scad)


def generate_bin(cols: int, rows: int, w: float, d: float, h: float, wall: float = 1.5) -> bytes:
    scad = f"""
for (x = [0:{cols-1}]) for (y = [0:{rows-1}]) {{
  translate([x*({w}+{wall}), y*({d}+{wall}), 0])
    difference() {{
      cube([{w}+{wall*2}, {d}+{wall*2}, {h}]);
      translate([{wall}, {wall}, {wall}])
        cube([{w}, {d}, {h}]);
    }}
}}
"""
    return run_openscad(scad)
