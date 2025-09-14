
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
  >
    <path
      d="M13.25,2.5H6.81C4.78,2.5,3.13,4.16,3.13,6.19V17.81C3.13,19.84,4.78,21.5,6.81,21.5H13.25C17.2,21.5,20.5,18.73,20.5,15.28V8.72C20.5,5.27,17.2,2.5,13.25,2.5ZM13.04,13.02H8.38V10.98H13.04C14.07,10.98,14.9,11.8,14.9,12C14.9,12.2,14.07,13.02,13.04,13.02ZM13.04,8.92H8.38V6.88H13.04C14.07,6.88,14.9,7.7,14.9,7.9C14.9,8.1,14.07,8.92,13.04,8.92Z"
      fill="currentColor"
    />
  </svg>
);
