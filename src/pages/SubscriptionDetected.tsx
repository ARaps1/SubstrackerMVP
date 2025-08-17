import { X, Bookmark, Shield } from "lucide-react";

interface SubscriptionData {
  service: string;
  plan: string;
  price: string;
  nextBilling: string;
  icon: string;
}

interface HeaderProps {
  subscription: SubscriptionData;
  onClose: () => void;
}

function Header({ subscription, onClose }: HeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          <span className="text-2xl sm:text-3xl leading-none">
            {subscription.icon}
          </span>
        </div>
        <div className="items-start">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Subscription Detected
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {subscription.plan}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

interface SmartDetectionProps {
  service: string;
}

function SmartDetection({ service }: SmartDetectionProps) {
  return (
    <div className="bg-purple-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-400 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
        </div>
        <h2 className="text-xs sm:text-sm font-semibold text-purple-700">
          Smart Detection
        </h2>
      </div>
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
        We detected a subscription to{" "}
        <span className="font-semibold">{service}</span>. Track it to manage
        your recurring payments and never miss a renewal.
      </p>
    </div>
  );
}

interface SubscriptionDetailsProps {
  subscription: SubscriptionData;
}

function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const details = [
    { label: "Service", value: subscription.plan },
    { label: "Price", value: subscription.price },
    { label: "Next Billing", value: subscription.nextBilling },
  ];

  return (
    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
      {details.map((detail) => (
        <div key={detail.label} className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">
            {detail.label}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-900">
            {detail.value}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ActionButtonsProps {
  onSave: () => void;
  onDecline: () => void;
  onHide: () => void;
}

function ActionButtons({ onSave, onDecline, onHide }: ActionButtonsProps) {
  return (
    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
      <button
        onClick={onSave}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Bookmark size={14} className="sm:w-4 sm:h-4" />
        Save Subscription
      </button>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onDecline}
          className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Decline
        </button>
        <button
          onClick={onHide}
          className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Hide
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <Shield size={10} className="sm:w-3 sm:h-3 text-green-500" />
        <span className="text-xs">Secure & Private</span>
      </div>
      <span className="text-xs">Powered by SubTracker</span>
    </div>
  );
}

export default function SubscriptionDetected() {
  // Dummy data
  const subscription: SubscriptionData = {
    service: "Netflix",
    plan: "Netflix Premium",
    price: "$15.99/month",
    nextBilling: "Jan 15, 2024",
    icon: "🎬",
  };

  // Event handlers
  const handleClose = () => {
    console.log("Close clicked");
    window.close();
  };

  const handleSave = () => {
    console.log("Save subscription clicked");
    handleClose();
  };

  const handleDecline = () => {
    console.log("Decline clicked");
    handleClose();
  };

  const handleHide = () => {
    console.log("Hide clicked");
    handleClose();
  };

  return (
    <div className="w-full h-full bg-transparent flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm max-w-sm sm:max-w-md w-full p-4 sm:p-6">
        <Header subscription={subscription} onClose={handleClose} />
        <SmartDetection service={subscription.service} />
        <SubscriptionDetails subscription={subscription} />
        <ActionButtons
          onSave={handleSave}
          onDecline={handleDecline}
          onHide={handleHide}
        />
        <Footer />
      </div>
    </div>
  );
}
