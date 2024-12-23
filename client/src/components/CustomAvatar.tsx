import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const CustomAvatar = ({ name }: { name: string }) => {
  function getInitials() {
    const words = name.split(" ");
    // console.log(words);
    const firstChar = words[0][0].toUpperCase();

    if (words.length == 1) {
      return firstChar;
    } else {
      const secondChar = words[1].length > 0 ? words[1][0].toUpperCase() : "";

      if (secondChar != "") {
        return firstChar + secondChar;
      } else {
        return firstChar;
      }
    }
  }
  return (
    <Avatar className='h-8 w-8 rounded-lg'>
      {/* <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' /> */}
      <AvatarFallback className='rounded-lg'>{getInitials()}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
