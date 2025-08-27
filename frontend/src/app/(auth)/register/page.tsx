import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-primary rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">Evolution AI</span>
          </div>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
