import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PublicLayout from '@/components/layout/PublicLayout';

const FAQ = () => {
  const faqData = [
    {
      question: "What types of issues can I report through this system?",
      answer: "Plumbing, electrical, furniture, cleaning, Wi-Fi, security, and maintenance issues."
    },
    {
      question: "How do I create an account to report issues?",
      answer: "Use your USM student ID and university email to register."
    },
    {
      question: "Is there a mobile app available for reporting issues?",
      answer: "No, but the website works on all devices including phones."
    },
    {
      question: "What information should I include when submitting a complaint?",
      answer: "Clear description, photos, and urgency level."
    },
    {
      question: "How can I check the status of my submitted complaint?",
      answer: "Check your dashboard for status updates."
    },
    {
      question: "What should I do for emergency maintenance situations?",
      answer: "Contact hostel office directly for urgent safety issues."
    },
    {
      question: "Can I submit complaints anonymously?",
      answer: "No, student login is required for tracking."
    },
    {
      question: "What happens after my complaint has been resolved?",
      answer: "You can provide feedback on the service."
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600 text-lg">
              Common questions about our hostel complaint system
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <AccordionTrigger className="text-left px-4 py-4 hover:no-underline text-gray-900 font-semibold text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FAQ;