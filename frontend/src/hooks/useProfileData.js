import { useState, useEffect } from "react";
import { useUserProfile } from "./useUserProfile";

export function useProfileData() {
  const { userProfile, loading } = useUserProfile();
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    dob: "",
    student_number: "",
    college: "",
    degree: "",
    present_address: "",
    classification: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  const handleSave = async () => {
    // TODO: Save
    setIsEditing(false);
  };

  return {
    userProfile,
    loading,
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    handleSave,
  };
}
