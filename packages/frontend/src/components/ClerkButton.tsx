import { Button } from "./Button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, UserButton } from "@clerk/nextjs";
export const ClerkButton = () => {
  return (
    <div>
      <SignedOut>
        <SignInButton mode={"modal"}>
          <Button variant="contained" color="primary">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" showName />
      </SignedIn>
    </div>
  );
};
