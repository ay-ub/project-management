// import MultiSelect from "@/components/MultiSelect";
import useUser from "@/store/userStore";

function Profile() {
  const user = useUser((state) => state.user);
  console.log(user);
  return (
    <div>
      {/* <MultiSelect /> */}
      Profile
    </div>
  );
}

export default Profile;
