import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from './ui/use-toast';
import { usePlan } from '@/contexts/PlanContext';
import { Snowflake, MapPin, Phone, Calendar, Package, User } from 'lucide-react';

interface ColdStorageFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColdStorageForm: React.FC<ColdStorageFormProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPlan } = usePlan();
  const [formData, setFormData] = useState({
    farmerName: '',
    farmLocation: '',
    phoneNumber: '',
    email: '',
    farmSize: '',
    produceType: '',
    estimatedQuantity: '',
    preferredDuration: '',
    nearestFacility: '',
    specialRequirements: '',
    agreedToTerms: false,
    selectedPlan: 'premium' as 'free' | 'premium' | 'enterprise'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Set the selected plan
    setPlan(formData.selectedPlan);

    // Simulate form submission
    toast({
      title: "Registration Successful! ✅",
      description: `Your cold storage request has been submitted with ${formData.selectedPlan} plan. ${formData.selectedPlan === 'free' ? 'Redirecting to dashboard...' : 'We\'ll contact you within 24 hours.'}`,
      duration: 5000
    });

    // Navigate to dashboard if free plan is selected
    if (formData.selectedPlan === 'free') {
      setTimeout(() => {
        navigate('/');
        onClose();
      }, 1500);
    } else {
      // Reset form and close for other plans
      setFormData({
        farmerName: '',
        farmLocation: '',
        phoneNumber: '',
        email: '',
        farmSize: '',
        produceType: '',
        estimatedQuantity: '',
        preferredDuration: '',
        nearestFacility: '',
        specialRequirements: '',
        agreedToTerms: false,
        selectedPlan: 'premium'
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Snowflake className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl text-primary">Cold Storage Registration</CardTitle>
                  <p className="text-muted-foreground">Register for accessible cold storage facilities</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmerName">Full Name *</Label>
                    <Input
                      id="farmerName"
                      value={formData.farmerName}
                      onChange={(e) => handleInputChange('farmerName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com (optional)"
                  />
                </div>
              </div>

              {/* Farm Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Farm Details
                </h3>
                
                <div>
                  <Label htmlFor="farmLocation">Farm Location *</Label>
                  <Input
                    id="farmLocation"
                    value={formData.farmLocation}
                    onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                    placeholder="Village, Taluk, District, State"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="farmSize">Farm Size (Acres) *</Label>
                    <Input
                      id="farmSize"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      placeholder="e.g., 5 acres"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="produceType">Primary Produce Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('produceType', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select produce type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">🥦 Vegetables</SelectItem>
                        <SelectItem value="fruits">🍎 Fruits</SelectItem>
                        <SelectItem value="grains">🌾 Grains</SelectItem>
                        <SelectItem value="herbs">🌿 Herbs & Spices</SelectItem>
                        <SelectItem value="mixed">🌱 Mixed Produce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Select Your Plan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Free Plan */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedPlan === 'free' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('selectedPlan', 'free')}
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">Free Plan</h4>
                      <p className="text-2xl font-bold text-primary mb-3">₹0/month</p>
                      <ul className="text-sm space-y-1 text-left">
                        <li>✅ Weather updates</li>
                        <li>✅ Market trends</li>
                        <li>✅ Government schemes</li>
                        <li>✅ AI assistant</li>
                        <li>✅ Grocery marketplace</li>
                        <li>❌ Crop monitoring</li>
                        <li>❌ Disease detection</li>
                      </ul>
                    </div>
                    {formData.selectedPlan === 'free' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                    )}
                  </motion.div>

                  {/* Premium Plan */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedPlan === 'premium' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('selectedPlan', 'premium')}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">Premium Plan</h4>
                      <p className="text-2xl font-bold text-primary mb-3">₹999/month</p>
                      <ul className="text-sm space-y-1 text-left">
                        <li>✅ All Free features</li>
                        <li>✅ Advanced crop monitoring</li>
                        <li>✅ AI disease detection</li>
                        <li>✅ Cold storage access</li>
                        <li>✅ Priority support</li>
                        <li>✅ Detailed analytics</li>
                      </ul>
                    </div>
                    {formData.selectedPlan === 'premium' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                    )}
                  </motion.div>

                  {/* Enterprise Plan */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.selectedPlan === 'enterprise' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('selectedPlan', 'enterprise')}
                  >
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">Enterprise Plan</h4>
                      <p className="text-2xl font-bold text-primary mb-3">₹2999/month</p>
                      <ul className="text-sm space-y-1 text-left">
                        <li>✅ All Premium features</li>
                        <li>✅ Multi-farm management</li>
                        <li>✅ Custom integrations</li>
                        <li>✅ Dedicated support</li>
                        <li>✅ Advanced reporting</li>
                        <li>✅ API access</li>
                      </ul>
                    </div>
                    {formData.selectedPlan === 'enterprise' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Storage Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Snowflake className="h-5 w-5" />
                  Storage Requirements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedQuantity">Estimated Quantity *</Label>
                    <Input
                      id="estimatedQuantity"
                      value={formData.estimatedQuantity}
                      onChange={(e) => handleInputChange('estimatedQuantity', e.target.value)}
                      placeholder="e.g., 500 kg, 2 tons"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredDuration">Storage Duration *</Label>
                    <Select onValueChange={(value) => handleInputChange('preferredDuration', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 Week</SelectItem>
                        <SelectItem value="2-weeks">2 Weeks</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="2-months">2 Months</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="custom">Custom Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nearestFacility">Preferred Cold Storage Facility</Label>
                  <Select onValueChange={(value) => handleInputChange('nearestFacility', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose nearest facility (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore Cold Storage Hub</SelectItem>
                      <SelectItem value="mysore">Mysore Agri Cold Chain</SelectItem>
                      <SelectItem value="hubli">Hubli Farmer Storage Center</SelectItem>
                      <SelectItem value="mangalore">Mangalore Coastal Storage</SelectItem>
                      <SelectItem value="any">Any Available Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any specific temperature, humidity, or handling requirements..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the terms and conditions, and understand that storage charges will be based on space used and duration. I consent to receiving SMS alerts and updates about my stored produce.
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Snowflake className="h-4 w-4 mr-2" />
                    Register for Cold Storage
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};