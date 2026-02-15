import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    roles?: Array<{ id: number; name: string; slug: string }>;
};

export default function Register({ roles = [] }: Props) {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const form = useForm({
        role_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        dob: '',
        gender: '',
        email: '',
        contact_number: '',
        street: '',
        brgy: '',
        municipality: '',
        province: '',
        postal_code: '',
        password: '',
        password_confirmation: '',
        id_document_1: null as File | null,
        id_document_2: null as File | null,
    });
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        form.post(store().url, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                <div className="grid gap-6 rounded-lg border p-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Account Type</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="role_id">
                                Select Account Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={selectedRole}
                                onValueChange={(value) => {
                                    setSelectedRole(value);
                                    form.setData('role_id', value);
                                }}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.role_id} />
                            <p className="text-xs text-muted-foreground">
                                Your account will be reviewed by a super admin before approval.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="given-name"
                                    name="first_name"
                                    placeholder="First name"
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData('first_name', e.target.value)}
                                />
                                <InputError message={form.errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle Name (Optional)</Label>
                                <Input
                                    id="middle_name"
                                    type="text"
                                    tabIndex={2}
                                    autoComplete="additional-name"
                                    name="middle_name"
                                    placeholder="Middle name"
                                    value={form.data.middle_name}
                                    onChange={(e) => form.setData('middle_name', e.target.value)}
                                />
                                <InputError message={form.errors.middle_name} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    autoComplete="family-name"
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData('last_name', e.target.value)}
                                />
                                <InputError message={form.errors.last_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={form.data.gender}
                                    onValueChange={(value) => form.setData('gender', value)}
                                >
                                    <SelectTrigger id="gender" tabIndex={4}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.gender} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                required
                                tabIndex={5}
                                name="dob"
                                value={form.data.dob}
                                onChange={(e) => form.setData('dob', e.target.value)}
                            />
                            <InputError message={form.errors.dob} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={6}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                <InputError message={form.errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contact_number">Contact Number</Label>
                                <Input
                                    id="contact_number"
                                    type="tel"
                                    tabIndex={7}
                                    autoComplete="tel"
                                    name="contact_number"
                                    placeholder="Contact number"
                                    value={form.data.contact_number}
                                    onChange={(e) => form.setData('contact_number', e.target.value)}
                                />
                                <InputError message={form.errors.contact_number} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Address</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="street">Street</Label>
                                <Input
                                    id="street"
                                    type="text"
                                    required
                                    tabIndex={8}
                                    autoComplete="street-address"
                                    name="street"
                                    placeholder="Street address"
                                    value={form.data.street}
                                    onChange={(e) => form.setData('street', e.target.value)}
                                />
                                <InputError message={form.errors.street} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="brgy">Barangay</Label>
                                <Input
                                    id="brgy"
                                    type="text"
                                    required
                                    tabIndex={9}
                                    name="brgy"
                                    placeholder="Barangay"
                                    value={form.data.brgy}
                                    onChange={(e) => form.setData('brgy', e.target.value)}
                                />
                                <InputError message={form.errors.brgy} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="municipality">Municipality</Label>
                                <Input
                                    id="municipality"
                                    type="text"
                                    required
                                    tabIndex={10}
                                    name="municipality"
                                    placeholder="Municipality"
                                    value={form.data.municipality}
                                    onChange={(e) => form.setData('municipality', e.target.value)}
                                />
                                <InputError message={form.errors.municipality} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="province">Province</Label>
                                <Input
                                    id="province"
                                    type="text"
                                    required
                                    tabIndex={11}
                                    name="province"
                                    placeholder="Province"
                                    value={form.data.province}
                                    onChange={(e) => form.setData('province', e.target.value)}
                                />
                                <InputError message={form.errors.province} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input
                                id="postal_code"
                                type="text"
                                required
                                tabIndex={12}
                                autoComplete="postal-code"
                                name="postal_code"
                                placeholder="Postal code"
                                value={form.data.postal_code}
                                onChange={(e) => form.setData('postal_code', e.target.value)}
                            />
                            <InputError message={form.errors.postal_code} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Account Security</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={13}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={14}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    value={form.data.password_confirmation}
                                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={form.errors.password_confirmation} />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={15}
                        disabled={form.processing}
                        data-test="register-user-button"
                    >
                        {form.processing && <Spinner />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()} tabIndex={16}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
