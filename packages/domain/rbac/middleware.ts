
export function requireRole(role: string) {

  return function (userRole: string) {

    if (userRole !== role) {
      throw new Error("Access denied")
    }

  }

}
