import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";

const AuthenticationPage = () => {
    return (
        <div className="auth-container">
            <SignedIn>
                <div className="redirect-message">
                    <h1>You are already signed in</h1>
                </div>
            </SignedIn>
            <SignedOut>
                <SignIn path="/sign-in" routing="path" />
                <SignUp path="/sign-up" routing="path" />
            </SignedOut>
        </div>
    );
};

export default AuthenticationPage;
