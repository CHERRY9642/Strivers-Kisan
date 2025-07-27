import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { Eye, EyeOff, Leaf, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  language: z.string().min(1, 'Please select a language'),
  plan: z.string().min(1, 'Please select a plan'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    emoji: '🌱',
    price: 'Free',
    features: [
      'Voice Assistant & Dashboard',
      'Weather Updates',
      'Government Schemes Access',
      'Market Trends Data'
    ],
    description: 'Access essential features for smart farming, excluding advanced crop monitoring and sensors.'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    emoji: '🌾',
    price: '₹10,000',
    features: [
      'All Free Plan Features',
      'Soil Moisture Sensor',
      'Temperature Sensor',
      'Installation Support',
      'AI Camera Unit',
      'NPK Sensor',
      'Advanced Crop Monitoring',
      'Dedicated Support'
    ],
    description: 'Unlock all features for comprehensive and professional farm management, including all sensors.'
  }
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState('profile');
  const { translateSync } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      language: 'en',
      plan: '',
    },
  });

  const onSubmit = (data: SignupForm) => {
    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('agritech_users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('agritech_users', JSON.stringify(users));
    localStorage.setItem('agritech_current_user', JSON.stringify(newUser));
    
    toast({
      title: translateSync("Account Created Successfully"),
      description: translateSync("Welcome to AgriTech! Your account has been created."),
    });
    
    navigate('/profile');
  };

  const nextStep = () => {
    if (step === 'profile') {
      // Validate profile fields
      form.trigger(['name', 'email', 'password', 'confirmPassword', 'phone', 'language']).then((isValid) => {
        if (isValid) setStep('plan');
      });
    }
  };

  const selectedPlan = plans.find(p => p.id === form.watch('plan'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-primary/5 via-background to-farm-accent/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-farm-primary to-farm-accent rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-farm-primary to-farm-accent bg-clip-text text-transparent">
            {translateSync("Join AgriTech")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {translateSync("Create your account and choose your farming plan")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'profile' ? 'bg-farm-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                {translateSync("Profile")}
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'plan' ? 'bg-farm-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                {translateSync("Plan")}
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Full Name")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={translateSync("Enter your full name")}
                              className="h-12"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Email")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={translateSync("Enter your email")}
                              type="email"
                              className="h-12"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Phone Number")}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={translateSync("Enter your phone number")}
                              type="tel"
                              className="h-12"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Preferred Language")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder={translateSync("Select language")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  <div className="flex items-center gap-2">
                                    <span>{lang.flag}</span>
                                    <span>{lang.nativeName}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Password")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder={translateSync("Create a password")}
                                type={showPassword ? "text" : "password"}
                                className="h-12 pr-12"
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translateSync("Confirm Password")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder={translateSync("Confirm your password")}
                                type={showConfirmPassword ? "text" : "password"}
                                className="h-12 pr-12"
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-farm-primary to-farm-accent">
                      {translateSync("Next")} <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="plan" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">{translateSync("Choose Your Plan")}</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {plans.map((plan) => (
                              <Card 
                                key={plan.id}
                                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                                  field.value === plan.id 
                                    ? 'ring-2 ring-farm-primary shadow-lg bg-farm-primary/5' 
                                    : 'hover:shadow-lg'
                                }`}
                                onClick={() => field.onChange(plan.id)}
                              >
                                <CardHeader className="text-center">
                                  <div className="text-4xl mb-2">{plan.emoji}</div>
                                  <CardTitle className="text-lg">{translateSync(plan.name)}</CardTitle>
                                  <div className="text-2xl font-bold text-farm-primary">{plan.price}</div>
                                  <CardDescription className="text-sm">
                                    {translateSync(plan.description)}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                      <li key={index} className="flex items-center gap-2 text-sm">
                                        <Check className="w-4 h-4 text-farm-accent" />
                                        {translateSync(feature)}
                                      </li>
                                    ))}
                                  </ul>
                                  {field.value === plan.id && (
                                    <div className="mt-4 text-center">
                                      <div className="inline-flex items-center gap-2 bg-farm-primary text-white px-3 py-1 rounded-full text-sm">
                                        <Check className="w-4 h-4" />
                                        {translateSync("Selected")}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep('profile')}>
                      <ChevronLeft className="w-4 h-4 mr-2" /> {translateSync("Back")}
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-farm-primary to-farm-accent"
                      disabled={form.formState.isSubmitting || !selectedPlan}
                    >
                      {form.formState.isSubmitting 
                        ? translateSync("Creating Account...") 
                        : translateSync("Create Account")
                      }
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {translateSync("Already have an account?")}{" "}
              <Link 
                to="/login" 
                className="font-medium text-farm-primary hover:text-farm-accent transition-colors"
              >
                {translateSync("Sign in")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;