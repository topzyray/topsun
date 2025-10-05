import { Card, CardContent, CardTitle } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface School {
  id: string;
  name: string;
  location: string;
  gradeLevel: string;
  status: "Active" | "Inactive";
}

const schoolsData: School[] = [
  {
    id: "1",
    name: "Green Valley High",
    location: "New York",
    gradeLevel: "High School",
    status: "Active",
  },
  {
    id: "2",
    name: "Riverdale Academy",
    location: "California",
    gradeLevel: "Middle School",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Lakeside International",
    location: "Texas",
    gradeLevel: "Elementary",
    status: "Active",
  },
  {
    id: "4",
    name: "Maple Ridge School",
    location: "Florida",
    gradeLevel: "High School",
    status: "Active",
  },
];

export const SchoolsList = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Onboarded Schools</h2>

      <Card>
        <CardTitle>Schools Overview</CardTitle>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schoolsData.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.location}</TableCell>
                  <TableCell>{school.gradeLevel}</TableCell>
                  <TableCell>
                    {school.status === "Active" ? (
                      <Badge variant="default">{school.status}</Badge>
                    ) : (
                      <Badge variant="destructive">{school.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      View Details
                    </Button>
                    <Button variant="link" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
