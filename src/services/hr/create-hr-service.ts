// import { add } from "date-fns";
import { supabase } from "../supabase";

// interface HrData {
//   first_name: string;
//   last_name: string;
//   email: string;
//   profile_image: string;
//   contact_number: string;
//   address: string;
//   gender: string;
//   birthdate: string;
//   department_id: number;
//   //   department_id: {
//   //     id: number;
//   //     departments: {
//   //       name: string;
//   //     };
//   //   };
//   position_id: number;
//   //     id: number;
//   //     positions: {
//   //       title: string;
//   //       level: string;
//   //       base_salary: number;
//   //     };
//   //   };
//   date_hired: string;
// }

interface HrData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  contactNumber: string;
  gender: "Male" | "Female" | "Other";
  birthdate: string;
  departmentId: string;
  positionId: string;
  photo: File | undefined;
}

// don't use yet (edge function on progress)
export const createHrEmployee = async (values: HrData) => {
  try {
    let profilePicUrl = null;
    if (values.photo) {
      const fileExt = values.photo.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles") // Make sure this bucket exists
        .upload(fileName, values.photo);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(fileName);

      profilePicUrl = publicUrl;
    }

    // Create auth user
    const { data: authUserDate, error: authUserError } =
      await supabase.auth.signUp({
        email: values.email,
        password: `${values.lastName}${values.firstName}`.toUpperCase(),
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: "HR",
          },
        },
      });

    if (authUserError) throw authUserError;

    // Check if auth user was created
    const authUserId = authUserDate.user?.id;
    if (!authUserId) throw new Error("Failed to get user ID from auth");

    // Retry logic for race condition given if there is some delay in creating the user in the database
    let userData = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (!userData && attempts < maxAttempts) {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("identity_id", authUserId)
        .single();

      if (data) {
        userData = data;
      } else if (attempts === maxAttempts - 1) {
        throw error || new Error("User not found after multiple attempts");
      } else {
        // Wait 500ms before retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      attempts++;
    }

    // Create user profile
    const { error: userProfileError } = await supabase
      .from("user_profiles")
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
        contact_number: values.contactNumber,
        address: values.address,
        birth_date: values.birthdate,
        gender: values.gender,
        profile_image: profilePicUrl,
      })
      .eq("user_id", userData!.id);

    if (userProfileError) throw userProfileError;

    // Create employee record
    const { error: employeeError } = await supabase
      .from("employees")
      .update({
        department_id: values.departmentId,
        position_id: values.positionId,
      })
      .eq("user_id", userData!.id);

    if (employeeError) throw employeeError;

    return userData;
  } catch (error) {
    console.error("Error creating HR employee:", error);
    throw error;
  }
};
