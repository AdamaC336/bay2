import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Download, 
  UserPlus, 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  User,
  PieChart,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateRelative } from "@/lib/utils";

export default function CustomerVault() {
  const { currentBrand } = useBrand();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample customer data since we don't have a real API for customers yet
  const customers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "(555) 123-4567",
      totalSpent: 1245.75,
      orderCount: 8,
      lastOrderDate: new Date(2023, 5, 15),
      status: "active",
      segment: "loyal"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "(555) 987-6543",
      totalSpent: 756.20,
      orderCount: 3,
      lastOrderDate: new Date(2023, 6, 22),
      status: "active",
      segment: "new"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@example.com",
      phone: "(555) 444-3333",
      totalSpent: 2145.50,
      orderCount: 12,
      lastOrderDate: new Date(2023, 7, 3),
      status: "active",
      segment: "vip"
    },
    {
      id: 4,
      name: "Dave Wilson",
      email: "dave.wilson@example.com",
      phone: "(555) 222-1111",
      totalSpent: 325.10,
      orderCount: 2,
      lastOrderDate: new Date(2023, 3, 12),
      status: "inactive",
      segment: "at-risk"
    },
    {
      id: 5,
      name: "Eve Brown",
      email: "eve.brown@example.com",
      phone: "(555) 777-8888",
      totalSpent: 1890.65,
      orderCount: 9,
      lastOrderDate: new Date(2023, 6, 28),
      status: "active",
      segment: "loyal"
    }
  ];
  
  // Customer metrics
  const customerMetrics = {
    total: 458,
    active: 392,
    new30d: 47,
    churn30d: 12,
    averageLifetimeValue: 682.45
  };
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Customer detail view state
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  
  // Sample customer orders for detail view
  const customerOrders = [
    { id: "ORD-12345", date: new Date(2023, 6, 28), amount: 225.50, status: "Delivered", items: 3 },
    { id: "ORD-12340", date: new Date(2023, 5, 15), amount: 189.95, status: "Delivered", items: 2 },
    { id: "ORD-12331", date: new Date(2023, 4, 3), amount: 145.20, status: "Delivered", items: 1 },
    { id: "ORD-12322", date: new Date(2023, 2, 18), amount: 320.75, status: "Delivered", items: 4 }
  ];
  
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">Customer Vault</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>
      
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Total Customers</p>
              <h3 className="text-2xl font-bold mt-1">{customerMetrics.total}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Active Customers</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{customerMetrics.active}</h3>
                <span className="ml-2 text-sm text-green-500">
                  {Math.round((customerMetrics.active / customerMetrics.total) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">New (30d)</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{customerMetrics.new30d}</h3>
                <span className="ml-2 text-sm text-green-500">+{Math.round((customerMetrics.new30d / customerMetrics.total) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Churn (30d)</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{customerMetrics.churn30d}</h3>
                <span className="ml-2 text-sm text-red-500">{Math.round((customerMetrics.churn30d / customerMetrics.total) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Avg. Lifetime Value</p>
              <h3 className="text-2xl font-bold mt-1">{formatCurrency(customerMetrics.averageLifetimeValue)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="mb-8">
        {selectedCustomer ? (
          // Customer Detail View
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-2 -ml-4 text-slate-400 hover:text-white"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <ChevronRight className="h-4 w-4 mr-1 rotate-180" /> Back to customers
                </Button>
                <CardTitle className="text-xl">Customer Profile</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" /> Contact
                </Button>
                <Button size="sm">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Create Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Find the selected customer */}
              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer);
                if (!customer) return <div>Customer not found</div>;
                
                return (
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 bg-slate-800 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-semibold text-white">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold">{customer.name}</h3>
                            <Badge 
                              variant={customer.segment === 'vip' ? 'success' : 
                                     customer.segment === 'loyal' ? 'default' :
                                     customer.segment === 'at-risk' ? 'destructive' : 
                                     'secondary'}
                              className="mt-1"
                            >
                              {customer.segment.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex">
                            <Mail className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                            <div>
                              <p className="text-sm text-slate-400">Email</p>
                              <p>{customer.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <Phone className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                            <div>
                              <p className="text-sm text-slate-400">Phone</p>
                              <p>{customer.phone}</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <ShoppingBag className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                            <div>
                              <p className="text-sm text-slate-400">Orders</p>
                              <p>{customer.orderCount} orders</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <DollarSign className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                            <div>
                              <p className="text-sm text-slate-400">Total Spent</p>
                              <p>{formatCurrency(customer.totalSpent)}</p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <Calendar className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                            <div>
                              <p className="text-sm text-slate-400">Last Order</p>
                              <p>{customer.lastOrderDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3">
                        <Tabs defaultValue="orders">
                          <TabsList className="bg-slate-800 mb-4">
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="orders" className="mt-0">
                            <div className="rounded-md border border-slate-800">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                    <TableHead className="text-slate-400">Order ID</TableHead>
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Items</TableHead>
                                    <TableHead className="text-slate-400">Amount</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {customerOrders.map((order) => (
                                    <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/50">
                                      <TableCell className="font-medium">{order.id}</TableCell>
                                      <TableCell>{order.date.toLocaleDateString()}</TableCell>
                                      <TableCell>{order.items}</TableCell>
                                      <TableCell>{formatCurrency(order.amount)}</TableCell>
                                      <TableCell>
                                        <Badge variant="success">{order.status}</Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="activity" className="mt-0">
                            <Card className="bg-slate-800 border-slate-700">
                              <CardContent className="pt-6">
                                <div className="space-y-4">
                                  <div className="flex">
                                    <div className="h-8 w-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-3">
                                      <ShoppingBag className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Placed an order <span className="text-blue-500">{customerOrders[0].id}</span></p>
                                      <p className="text-sm text-slate-400">{customerOrders[0].date.toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="h-8 w-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-3">
                                      <Mail className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Opened email campaign <span className="text-blue-500">Summer Sale</span></p>
                                      <p className="text-sm text-slate-400">{new Date(2023, 6, 15).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="h-8 w-8 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center mr-3">
                                      <Tag className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Applied coupon <span className="text-blue-500">SUMMER15</span></p>
                                      <p className="text-sm text-slate-400">{new Date(2023, 6, 12).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="h-8 w-8 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mr-3">
                                      <User className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                      <p className="font-medium">Updated account information</p>
                                      <p className="text-sm text-slate-400">{new Date(2023, 5, 28).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          
                          <TabsContent value="preferences" className="mt-0">
                            <Card className="bg-slate-800 border-slate-700">
                              <CardContent className="pt-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Product Preferences</h4>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500">Adult Formula</Badge>
                                      <Badge variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500">Joint Support</Badge>
                                      <Badge variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500">Large Breed</Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Communication Preferences</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span>Email Marketing</span>
                                        <Badge variant="success">Opted In</Badge>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>SMS Notifications</span>
                                        <Badge variant="success">Opted In</Badge>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Product Updates</span>
                                        <Badge variant="destructive">Opted Out</Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Purchase History Analysis</h4>
                                    <div className="mt-4 h-60 bg-slate-900 rounded-lg flex items-center justify-center">
                                      <PieChart className="h-8 w-8 text-slate-500" />
                                      <span className="ml-2 text-slate-500">Purchase patterns visualization would appear here</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                    
                    {/* AI Recommendations */}
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          AI Customer Insights
                        </CardTitle>
                        <CardDescription>Personalized recommendations based on customer behavior</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-md">
                            <h4 className="font-semibold text-blue-400 mb-1">Next Best Action</h4>
                            <p className="text-slate-300">This customer is due for a replenishment order. Consider sending a targeted email with a 10% discount code for their preferred product.</p>
                          </div>
                          
                          <div className="p-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-md">
                            <h4 className="font-semibold text-green-400 mb-1">Upsell Opportunity</h4>
                            <p className="text-slate-300">Based on purchase history, this customer may be interested in the new dental chews product line. Their dog's age and dietary preferences align with this product.</p>
                          </div>
                          
                          <div className="p-4 bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-20 rounded-md">
                            <h4 className="font-semibold text-purple-400 mb-1">Loyalty Status</h4>
                            <p className="text-slate-300">This customer is close to reaching VIP status. A personalized note thanking them for their continued support could help increase retention and move them into the VIP segment.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        ) : (
          // Customer List View
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Customers</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Search customers..."
                      className="pl-8 w-full md:w-64 bg-slate-800 border-slate-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Name</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Total Spent</TableHead>
                      <TableHead className="text-slate-400">Orders</TableHead>
                      <TableHead className="text-slate-400">Last Order</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id} 
                        className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer.id)}
                      >
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                        <TableCell>{customer.orderCount}</TableCell>
                        <TableCell>{formatDateRelative(customer.lastOrderDate)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={customer.status === 'active' ? 'success' : 'secondary'}
                          >
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer.id);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
