'use client'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            // Simulate login API
            console.log(values);
            router.push('/dashboard');
        } catch (err) {
            console.log(err);
            form.setError('email', { type: 'manual', message: 'Invalid credentials' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-500">Sign in to your account</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            className="bg-white border-gray-300 hover:border-blue-300 focus:border-blue-500 focus-visible:ring-blue-200"
                                            placeholder="your@email.com"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            className="bg-white border-gray-300 hover:border-blue-300 focus:border-blue-500 focus-visible:ring-blue-200"
                                            placeholder="••••••••"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />


                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            {"Don't have an account? "}
                            <Link
                                href="/register"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}