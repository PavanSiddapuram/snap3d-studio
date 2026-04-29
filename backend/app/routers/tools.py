from fastapi import APIRouter
from fastapi.responses import Response

router = APIRouter()


@router.post("/lithophane")
async def lithophane():
    # TODO: CPU worker — Pillow + NumPy height-map → STL
    return Response(status_code=501)


@router.post("/3dtext")
async def text_3d(text: str, font: str = "sans", depth_mm: float = 5.0):
    # TODO: OpenSCAD CLI — linear_extrude + text()
    return Response(status_code=501)


@router.post("/vase")
async def vase():
    # TODO: OpenSCAD CLI — rotate_extrude
    return Response(status_code=501)


@router.post("/bin")
async def bin_tray():
    # TODO: OpenSCAD CLI — cube grid
    return Response(status_code=501)


@router.post("/nameplate")
async def nameplate():
    # TODO: OpenSCAD CLI — text + shape cutout
    return Response(status_code=501)
