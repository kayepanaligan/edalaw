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
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors, setData, data = {} }) => {
                    const gender = data?.gender || '';
                    
                    return (
                    <>
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Personal Information</h3>
                                
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
                                        value={data?.first_name || ''}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                    <InputError message={errors.first_name} className="mt-2" />
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
                                        value={data?.middle_name || ''}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                    />
                                    <InputError message={errors.middle_name} className="mt-2" />
                                </div>

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
                                        value={data?.last_name || ''}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        tabIndex={4}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Full name"
                                        value={data?.name || ''}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        required
                                        tabIndex={5}
                                        name="dob"
                                        value={data?.dob || ''}
                                        onChange={(e) => setData('dob', e.target.value)}
                                    />
                                    <InputError message={errors.dob} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={gender}
                                        onValueChange={(value) => setData('gender', value)}
                                    >
                                        <SelectTrigger id="gender" tabIndex={6}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="gender" value={gender} />
                                    <InputError message={errors.gender} className="mt-2" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Contact Information</h3>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={7}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={data?.email || ''}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Address</h3>
                                
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
                                        value={data?.street || ''}
                                        onChange={(e) => setData('street', e.target.value)}
                                    />
                                    <InputError message={errors.street} className="mt-2" />
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
                                        value={data?.brgy || ''}
                                        onChange={(e) => setData('brgy', e.target.value)}
                                    />
                                    <InputError message={errors.brgy} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="municipality">Municipality</Label>
                                    <Input
                                        id="municipality"
                                        type="text"
                                        required
                                        tabIndex={10}
                                        name="municipality"
                                        placeholder="Municipality"
                                        value={data?.municipality || ''}
                                        onChange={(e) => setData('municipality', e.target.value)}
                                    />
                                    <InputError message={errors.municipality} className="mt-2" />
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
                                        value={data?.province || ''}
                                        onChange={(e) => setData('province', e.target.value)}
                                    />
                                    <InputError message={errors.province} className="mt-2" />
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
                                        value={data?.postal_code || ''}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                    />
                                    <InputError message={errors.postal_code} className="mt-2" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Account Security</h3>
                                
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
                                        value={data?.password || ''}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} />
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
                                        value={data?.password_confirmation || ''}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={15}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={16}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                    );
                }}
            </Form>
        </AuthLayout>
    );
}
