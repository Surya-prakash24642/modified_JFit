import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
import { Home, Dumbbell, Heart, Menu, Footprints, Calculator, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

// Supabase client configuration (replace with your actual Supabase URL and key)
const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Exercise", href: "/exercise", icon: Dumbbell },
  { name: "Steps", href: "/steps", icon: Footprints },
  { name: "Food Calories", href: "/food_calorie", icon: Heart },
  { name: "BMI", href: "/bmi", icon: Calculator },
];

interface NavigationContentProps {
  handleLogout: () => void;
}

const NavigationContent: React.FC<NavigationContentProps> = ({ handleLogout }) => (
  <nav className="flex flex-1 flex-col">
    <ul role="list" className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul role="list" className="-mx-2 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-50 hover:text-primary-gradient transition-all duration-200 ease-in-out"
              >
                <item.icon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-primary-gradient" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold hover:bg-gray-50 hover:text-red-600 transition-all duration-200 ease-in-out w-full text-left"
            >
              <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);

export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(data?.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-50" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                JFit
              </h1>
            </div>
            <NavigationContent handleLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
              JFit
            </h1>
          </div>
          <NavigationContent handleLogout={handleLogout} />
        </div>
      </div>
    </>
  );
};