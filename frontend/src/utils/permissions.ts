import { http } from "../api/http"
import { LockerPermission } from "../models/interfaces"

interface link {
    permissionUrl: string
    resourceUrl: string
    resource: (perm: LockerPermission) => string
}

export async function getPermissionData({ permissionUrl, resourceUrl, resource }: link) {
    const { data } = await http.get<LockerPermission[]>(permissionUrl)

    const validPermission = data.filter(
        perm => perm.expiresAt === null || new Date(perm.expiresAt) > new Date()
    )

    const response = await Promise.all(
        validPermission.map(perm => http.get(`${resourceUrl}/${resource(perm)}`))
    )

    return response.map(res => res.data)
}