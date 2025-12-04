"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Plus, ExternalLink } from "lucide-react";

export default function FeedbackPage() {
  
  const handleFeedbackForm = () => {
    // Replace with your actual Google Form URL for feedback
    const feedbackFormUrl = "https://forms.gle/your-feedback-form-url";
    window.open(feedbackFormUrl, "_blank");
  };

  const handleNewRequirementForm = () => {
    // Replace with your actual Google Form URL for new requirements
    const newRequirementFormUrl = "https://forms.gle/your-new-requirement-form-url";
    window.open(newRequirementFormUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Feedback and New Requirements
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              We value your input! Use the forms below to submit feedback on existing bills or propose new bill requirements.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Feedback on Existing Bills */}
            <Card className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-gray-900 mb-4">
                  Feedback on Existing Bills
                </h2>
                <p className="text-sm text-muted-foreground">
                  Help us improve our current billing system:
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Report issues with bill generation</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Suggest improvements for existing bill types</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Share your experience with our billing system</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Report any discrepancies or errors in bills</span>
                </div>
              </div>

              <Button
                onClick={handleFeedbackForm}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                OPEN FEEDBACK FORM
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* New Bill Requirements */}
            <Card className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-base font-medium text-gray-900 mb-4">
                  New Bill Requirements
                </h2>
                <p className="text-sm text-muted-foreground">
                  Propose new features or bill types:
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Suggest new types of bills</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Describe specific features for new bills</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Propose improvements based on industry standards</span>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Share your business needs for customized billing</span>
                </div>
              </div>

              <Button
                onClick={handleNewRequirementForm}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                OPEN NEW REQUIREMENT FORM
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground max-w-4xl mx-auto">
              We typically respond to all feedback and new requirements within <span className="font-medium text-gray-900">2-3 business days</span>. 
              Thank you for helping us improve our service!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}