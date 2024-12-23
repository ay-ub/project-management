import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className='flex justify-center'>
      <Loader2 className='animate-spin' />
    </div>
  );
}

export default Loader;
