'use client'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    name: z.string().min(3, 'Name must be at least 3 characters').max(50, 'Name must be less than 50 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
    const { register } = useAuth();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            name: '',
            password: ''
        }
    });

    const onSubmit = async (values: RegisterFormValues) => {
        register(values)
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                    <p className="text-slate-500">Join us today and get started</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-white border-gray-300 hover:border-blue-300 focus:border-blue-500 focus-visible:ring-blue-200"
                                            placeholder="John Doe"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

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
                            Register
                        </Button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}