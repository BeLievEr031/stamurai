import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">TaskMaster Pro</h1>
          <nav className="space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</Link>
            <Link href="#dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">Dashboard</Link>
            <Link href="#auth" className="text-gray-700 hover:text-indigo-600 font-medium">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="py-20 bg-gradient-to-b from-indigo-100 to-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-indigo-700 mb-4">Organize. Collaborate. Succeed.</h2>
          <p className="text-lg text-gray-700 mb-8">A powerful yet simple task management tool for modern teams.</p>
          <Link href="/register" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">Get Started</Link>
        </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-indigo-700 mb-12">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">✅ User Authentication</h4>
              <p className="text-gray-600">Secure registration and login using best practices in password storage and session handling.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">✅ Task Management</h4>
              <p className="text-gray-600">Create, update, delete, and view tasks with customizable attributes like priority and due date.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">✅ Team Collaboration</h4>
              <p className="text-gray-600">Assign tasks to team members and notify them automatically when tasks are assigned.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">✅ Search & Filter</h4>
              <p className="text-gray-600">Quickly find tasks with search and filter options based on status, priority, and deadlines.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-indigo-700 mb-8">Your Personal Dashboard</h3>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li>📌 Tasks assigned to you</li>
            <li>📝 Tasks you created</li>
            <li>⏰ Overdue tasks</li>
          </ul>
        </div>
      </section>

      <section id="auth" className="py-20 bg-white text-center">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">Ready to get started?</h3>
        <p className="text-lg text-gray-700 mb-8">Sign up now and take control of your teams productivity.</p>
        <Link href="/register" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">Create Account</Link>
      </section>

      <footer className="py-6 bg-gray-200 text-center text-gray-600">
        © 2025 TaskMaster Pro. All rights reserved.
      </footer>
    </main>
  );
}
