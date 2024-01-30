"use client"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { admin } from "@/actions/admin"
import { toast } from "sonner"



const AdminPage =  () => {

  const onClick = async () => {
    admin()
    .then(data => {
      if (data?.error) {
        toast.error(data.error)
      }

      if (data?.success) {
        toast.success(data.success)
      }
    })
  }


  return (
    <Card className="w-[70%]">
      <CardHeader>
      <p className="text-2xl font font-semibold text-center">Admin Page</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-y-6">
        
        <RoleGate allowedRole="ADMIN">
          <FormSuccess  message="If you can see this text, you are an admin!" />
        </RoleGate>
        <Button onClick={onClick}>Test Server Action</Button>
      </CardContent>
    </Card>
  )
}

export default AdminPage
