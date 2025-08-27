import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePayment } from "@/hooks/useAPI";
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Loader2,
  Shield
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    id: string;
    name: string;
    price: string;
    originalPrice: string;
  };
  leadData: {
    name: string;
    email: string;
    phone: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  leadData 
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: leadData.name
  });
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  
  const { toast } = useToast();
  const { processPayment, processing, paymentStatus, resetPayment } = usePayment();

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    try {
      setStep('processing');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment success
      const paymentResult = await processPayment(1, selectedPlan.id);

      setStep('success');
      
      toast({
        title: "🎉 Thanh toán thành công!",
        description: `Chúc mừng bạn đã đăng ký khóa học ${selectedPlan.name}`,
        duration: 5000,
      });

    } catch (error) {
      setStep('payment');
      toast({
        title: "Thanh toán thất bại",
        description: "Vui lòng kiểm tra lại thông tin thẻ và thử lại",
        variant: "destructive"
      });
    }
  };

  const renderPaymentStep = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Chi tiết đơn hàng</h4>
        <div className="flex justify-between items-center mb-2">
          <span>Gói {selectedPlan.name}</span>
          <span className="line-through text-gray-500">{selectedPlan.originalPrice}đ</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Giá sau giảm 50%</span>
          <span className="font-bold text-green-600">{selectedPlan.price}đ</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center font-bold">
            <span>Tổng thanh toán</span>
            <span className="text-xl text-blue-600">{selectedPlan.price}đ</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Số thẻ tín dụng</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className="pl-10"
              maxLength={19}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Ngày hết hạn</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={paymentData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength={3}
                type="password"
              />
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="cardholderName">Tên chủ thẻ</Label>
          <Input
            id="cardholderName"
            value={paymentData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
          />
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Thanh toán được bảo mật bằng SSL 256-bit</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Hủy
        </Button>
        <Button onClick={handlePayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Thanh toán {selectedPlan.price}đ
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
      <h3 className="text-lg font-semibold mb-2">Đang xử lý thanh toán...</h3>
      <p className="text-gray-600">Vui lòng không đóng cửa sổ này</p>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Thanh toán thành công! 🎉</h3>
      <p className="text-gray-600 mb-4">
        Cảm ơn bạn đã đăng ký khóa học <strong>{selectedPlan.name}</strong>
      </p>
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-green-700">
          📧 Email xác nhận và hướng dẫn truy cập khóa học đã được gửi đến: <br/>
          <strong>{leadData.email}</strong>
        </p>
      </div>
      <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
        Hoàn tất
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'payment' && 'Thanh toán khóa học'}
            {step === 'processing' && 'Xử lý thanh toán'}
            {step === 'success' && 'Hoàn tất đăng ký'}
          </DialogTitle>
        </DialogHeader>

        {step === 'payment' && renderPaymentStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
