"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQs() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are the admission requirements?",
      answer:
        "We welcome students aged 5-18. Application includes completed forms, previous school records, and an informal assessment. We operate a rolling admissions policy with intake points in September, January, and April.",
    },
    {
      question: "What is the uniform policy?",
      answer:
        "Our uniform consists of navy blazer, white shirt, school tie, and grey trousers/skirt. PE kit includes house-colored polo shirt and navy shorts/tracksuit. All items are available from our uniform supplier.",
    },
    {
      question: "Do you provide school transport?",
      answer:
        "Yes, we offer bus services covering a 15-mile radius. Routes are updated annually based on demand. Private transport can also be arranged through our partner companies.",
    },
    {
      question: "What meals are available?",
      answer:
        "Our on-site kitchen provides fresh, nutritious meals daily. We cater to all dietary requirements including vegetarian, vegan, halal, and allergen-free options. Students can pay by cashless system.",
    },
    {
      question: "What extra-curricular activities do you offer?",
      answer:
        "We offer 40+ activities including sports teams, music ensembles, drama productions, coding club, and debate society. Activities run before school, during lunch, and after school.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Badge className="mb-4">Got Questions?</Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
              {expandedFaq === index && (
                <CardContent>
                  <Separator className="mb-4" />
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
