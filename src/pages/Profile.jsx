import { EditProfileForm } from "@/components/EditProfileForm"
import { useSelector } from "react-redux"

const Profile = () => {
  const user = useSelector((store) => store.user)
  return user && (
    <div>
      <EditProfileForm user={ user } />
   </div>
  
    
  )
}

export default Profile