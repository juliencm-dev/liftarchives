import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { Activity, Trophy, Calendar, Target, Plus, TrendingUp, Clock, Dumbbell } from 'lucide-react';

const stats = [
    { label: 'Sessions This Week', value: '0', icon: Activity },
    { label: 'Personal Records', value: '\u2014', icon: Trophy },
    { label: 'Active Program', value: 'None', icon: Calendar },
    { label: 'Next Competition', value: '\u2014', icon: Target },
];

export function DashboardPage() {
    const { user } = useAuth();
    const firstName = (user as { name?: string })?.name?.split(' ')[0] ?? 'Lifter';

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold">
                    Welcome back, <span className="text-primary">{firstName}</span>
                </h1>
                <p className="text-muted-foreground mt-1">Here's your training overview</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                                    <p className="text-lg font-semibold">{stat.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Session
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                    <Link to="/lifts">
                        <TrendingUp className="h-4 w-4" />
                        View Lifts
                    </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                    <Link to="/programs">
                        <Calendar className="h-4 w-4" />
                        Browse Programs
                    </Link>
                </Button>
            </div>

            {/* Bottom Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <Activity className="h-10 w-10 text-muted-foreground/40 mb-3" />
                            <p className="font-medium text-muted-foreground">No recent activity</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Start logging sessions to see your activity here
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Training */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            Today's Training
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
                            <p className="font-medium text-muted-foreground">No training scheduled for today</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Set up a program to see your daily plan
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
