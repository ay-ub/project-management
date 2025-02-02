import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import CustomAvatar from "@/components/CustomAvatar";
import useUser from "@/store/userStore";

export function NavUser() {
  const { isMobile } = useSidebar();
  const logout = useUser((state) => state.logout);
  const user = useUser((state) => state.user);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CustomAvatar name={`${user?.name} ${user?.familyName}`} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{`${user?.name} ${user?.familyName}`}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <CustomAvatar name={`${user?.name} ${user?.familyName}`} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`${user?.name} ${user?.familyName}`}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <Link to={`profile/${user?.name}-${user?.familyName}`}>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup> 
            <DropdownMenuSeparator />*/}
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
