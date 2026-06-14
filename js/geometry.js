// Works out how each portal connects to the highway grid.

// Closest vertical main line whose span covers z, within 100 blocks of x.
export function findClosestX(innerLines, x, z) {
    const candidates = innerLines.filter(l =>
        l.main === 1 && l.x1 === l.x2 &&
        Math.abs(l.x1 - x) <= 100 &&
        z >= Math.min(l.z1, l.z2) && z <= Math.max(l.z1, l.z2)
    )
    if (candidates.length === 0) return null
    return candidates.reduce((a, b) => Math.abs(b.x1 - x) < Math.abs(a.x1 - x) ? b : a).x1
}

// Closest horizontal main line whose span covers x, within 100 blocks of z.
export function findClosestZ(innerLines, x, z) {
    const candidates = innerLines.filter(l =>
        l.main === 1 && l.z1 === l.z2 &&
        Math.abs(l.z1 - z) <= 100 &&
        x >= Math.min(l.x1, l.x2) && x <= Math.max(l.x1, l.x2)
    )
    if (candidates.length === 0) return null
    return candidates.reduce((a, b) => Math.abs(b.z1 - z) < Math.abs(a.z1 - z) ? b : a).z1
}

// Decide which method to use to draw a portal's connector line. Returns one of:
// 'inner', 'specialX', 'specialZ', 'autoX', 'autoZ', or 'none'.
export function lineDrawingMode(innerLines, { innerLineId, specialX, specialZ, x, z }) {
    if (innerLines.some(l => innerLineId === l.ID)) return 'inner'
    if (specialX !== '') return 'specialX'
    if (specialZ !== '') return 'specialZ'

    const closestX = findClosestX(innerLines, x, z)
    const closestZ = findClosestZ(innerLines, x, z)
    if (closestX === null && closestZ === null) return 'none'
    if (closestX === null) return 'autoZ'
    if (closestZ === null) return 'autoX'
    return Math.abs(x - closestX) < Math.abs(z - closestZ) ? 'autoX' : 'autoZ'
}
