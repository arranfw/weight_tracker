import { signIn, signOut } from '@/auth';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-indigo-600">Weight Tracker</h1>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Dashboard
                </Link>
                <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >Sign Out</button>
    </form>
              </>
            ) : (
              <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                type="submit">Signin with GitHub</button>
            </form>
            )}
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-8 text-gray-900">Track Your Weight Journey</h2>
          <p className="text-xl text-gray-600 mb-12">
            A simple and effective way to monitor your weight over time and visualize your progress.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Visual Insights</h3>
              <p className="text-gray-600">See your progress with beautiful charts and analytics.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Private & Secure</h3>
              <p className="text-gray-600">Your data is always private and securely stored.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-500 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Access Anywhere</h3>
              <p className="text-gray-600">Track your progress from any device, anytime.</p>
            </div>
          </div>
          
          {!session?.user && (
            <Link
              href="/api/auth/signin/github"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
            >
              Get Started with GitHub
            </Link>
          )}
        </main>
      </div>
      
      <footer className="bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Weight Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
