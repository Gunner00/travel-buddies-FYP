import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import UniversalFadeAnimation from "./UniversalFadeComponent";
import { toast } from "react-hot-toast";
import { Image } from "next";
export default function Auth() {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState(null);

    const router = useRouter();

    // On mount, check to see if the user has an active session
    // If they do, set the session object in state
    // If they don't, send them to the Auth component
    // to sign in
    useEffect(() => {
        let mounted = true;

        async function getInitialSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            // only update the react state if the component is still mounted
            if (mounted) {
                if (session) {
                    setSession(session);
                    router.push("/profilePage");
                }

                setIsLoading(false);
            }
        }

        getInitialSession();

        const { subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            mounted = false;

            subscription?.unsubscribe();
        };
    }, [router]);
    
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [showInput, setShowInput] = useState(false);
    const handleLogin = async (email) => {
        try {
            setLoading(true);
            // If the email is not a Riphah email, throw an error
            if (!email.endsWith("@riphah.edu.pk")) {
                // throw new Error("Please use a Riphah email");
                toast("Please enter a Riphah International University email and try again.")
            }
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            toast.success("Check your email for the login link!");
        } catch (error) {
            toast(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UniversalFadeAnimation>
            <div className="flex flex-col gap-8 justify-center items-center w-screen h-screen bg-white">
            <UniversalFadeAnimation>
                    <h1 className="interSubheader shadow-2xl bg-black text-white px-3 py-2 rounded-full">
                        Travel Buddies
                    </h1>
                </UniversalFadeAnimation>
                <Image src="/images/authCityWomen.png" className="w-[40vw]" alt="students"/>
                <h1 className="interSubheader">Let's keep each other safe.</h1>
                <div className="mt-10 flex flex-col justify-center items-center gap-4">
                    <input
                        className="w-[70vw] rounded-full interBody px-10 py-4"
                        type="email"
                        placeholder="University Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogin(email);
                        }}
                        className="interSubheader w-full bg-black text-white py-4 px-10 rounded-full"
                        disabled={false}
                    >
                        {loading ? "Loading..." : "Send magic link"}
                    </button>
                </div>
            </div>
        </UniversalFadeAnimation>
    );
}
