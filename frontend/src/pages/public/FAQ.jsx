import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqData } from '@/data/mockData';
import PublicLayout from '@/components/layout/PublicLayout';

const FAQ = () => {
  return (
    <PublicLayout>
      <div className="bg-muted/50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <HelpCircle size={32} />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our hostel complaint system
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Alert className="mt-8">
            <AlertDescription className="text-center">
              <h3 className="font-semibold text-lg mb-2">Still need help?</h3>
              <p className="mb-4 text-muted-foreground">
                Can't find the answer you're looking for? Please contact our support team.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FAQ;