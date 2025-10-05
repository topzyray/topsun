import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DataCard({
  title,
  description,
  content,
  footer,
  style,
}: {
  title?: string;
  description?: string;
  content: any;
  footer?: any;
  style?: string;
}) {
  return (
    <Card className={`w-[350px] ${style}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-between">{footer}</CardFooter>
    </Card>
  );
}
