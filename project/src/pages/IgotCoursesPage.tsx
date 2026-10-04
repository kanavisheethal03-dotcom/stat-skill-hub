import { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  Star,
  Clock,
  Users as UsersIcon,
  CheckCircle2,
  BookOpen,
  Search,
  Filter,
  PlayCircle,
  Info,
  Sparkles,
  Globe,
} from 'lucide-react';
import { Card, Badge, PageHeader, Button, ProgressBar } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { openIGOTCourse, IGOT_COURSE_LIST_URL } from '@/utils/igotUtils';
import { cn } from '@/utils/cn';
import type { Difficulty, Course } from '@/types';

const difficultyColor: Record<Difficulty, string> = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

export function IgotCoursesPage() {
  const { courses, enrollments, isEnrolled, enrollCourse, unenrollCourse } = useApp();
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'all'>('all');
  const [enrollToast, setEnrollToast] = useState<string | null>(null);

  const filtered = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === 'all' || c.difficulty === filterDiff;
    return matchSearch && matchDiff;
  });

  const handleEnroll = (courseId: string, courseTitle: string) => {
    enrollCourse(courseId);
    setEnrollToast(`Enrolled in "${courseTitle}" (Demo Mode)`);
    setTimeout(() => setEnrollToast(null), 3000);
  };

  const handleUnenroll = (courseId: string) => {
    unenrollCourse(courseId);
  };

  const handleOpenIGOT = (course: Course) => {
    openIGOTCourse(course.igotUrl || IGOT_COURSE_LIST_URL, (msg) => {
      setEnrollToast(msg);
      setTimeout(() => setEnrollToast(null), 3000);
    });
  };

  return (
    <>
      <PageHeader
        title="iGOT Karmayogi Course Catalogue"
        subtitle="Browse and access curated government training courses mapped to official statistical competencies"
      >
        <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200">
          <GraduationCap size={12} /> iGOT Integrated
        </Badge>
      </PageHeader>

      {/* Demo mode & live course list notice */}
      <div className="mb-5 rounded-xl border border-primary-200 bg-primary-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-primary-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary-900">
              Curated iGOT Course Catalogue & Direct Portal Access
            </p>
            <p className="text-xs text-primary-700 mt-0.5 leading-relaxed">
              Clicking <span className="font-semibold text-primary-900">Watch on iGOT ↗</span> opens the official course list on the iGOT Karmayogi Bharat portal where government officers can enroll and learn.
            </p>
          </div>
        </div>
        <a
          href={IGOT_COURSE_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-900 shrink-0 bg-white border border-primary-200 rounded-lg px-3.5 py-2 transition-colors shadow-xs"
        >
          <Globe size={13} />
          Browse iGOT Course List ↗
        </a>
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="igot-search"
            type="text"
            placeholder="Search courses by title, topic, or course ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-neutral-400 shrink-0" />
          {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilterDiff(d)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize',
                filterDiff === d
                  ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              )}
            >
              {d === 'all' ? 'All Levels' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Available Courses', value: courses.length, icon: BookOpen },
          { label: 'My Enrollments', value: Object.keys(enrollments).length, icon: CheckCircle2 },
          {
            label: 'In Progress',
            value: Object.values(enrollments).filter((e) => e.status === 'in_progress' || e.status === 'enrolled').length,
            icon: PlayCircle,
          },
          {
            label: 'Completed',
            value: Object.values(enrollments).filter((e) => e.status === 'completed').length,
            icon: Star,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900">{value}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="lg:col-span-2 text-center py-12 text-neutral-400 bg-white rounded-2xl border border-neutral-200">
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No courses match your search.</p>
          </div>
        )}
        {filtered.map((course) => {
          const enrolled = isEnrolled(course.id);
          const enrollment = enrollments[course.id];

          return (
            <Card key={course.id} className="p-5 flex flex-col justify-between hover:shadow-md hover:border-primary-300 transition-all" hover>
              <div>
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-500 to-primary-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <GraduationCap size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug truncate">{course.title}</h3>
                      <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
                        {course.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        <GraduationCap size={9} /> iGOT Karmayogi
                      </Badge>
                      <Badge
                        variant={difficultyColor[course.difficulty] as 'success' | 'warning' | 'error'}
                        className="text-[10px] capitalize"
                      >
                        {course.difficulty}
                      </Badge>
                      <span className="text-[10px] text-neutral-500 truncate">{course.provider}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-3">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-accent-500 fill-accent-500" />
                    {course.rating} ({course.ratingCount || 45})
                  </span>
                  <span className="flex items-center gap-1">
                    <UsersIcon size={12} /> {course.enrolled?.toLocaleString('en-IN') || 500} enrolled
                  </span>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {course.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Enrollment progress bar */}
                {enrolled && enrollment && (
                  <div className="mb-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-500 capitalize">
                        {enrollment.status === 'enrolled' ? 'Enrolled' : enrollment.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-primary-600">{enrollment.progress}%</span>
                    </div>
                    <ProgressBar
                      value={enrollment.progress}
                      variant={enrollment.status === 'completed' ? 'success' : 'primary'}
                    />
                  </div>
                )}
              </div>

              {/* Actions: Removed "Watch in App", clicking "Watch on iGOT" navigates to iGOT course list */}
              <div className="flex gap-2 pt-3 border-t border-neutral-100">
                {!enrolled ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleEnroll(course.id, course.title)}
                  >
                    <CheckCircle2 size={13} /> Enroll (Demo)
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs border-success-300 text-success-700 hover:bg-success-50"
                    onClick={() => handleUnenroll(course.id)}
                  >
                    <CheckCircle2 size={13} className="text-success-600" />
                    {enrollment?.status === 'completed' ? 'Completed' : 'Enrolled'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => handleOpenIGOT(course)}
                  title={`Open course on iGOT: ${course.title}`}
                >
                  <ExternalLink size={13} />
                  Watch on iGOT ↗
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* iGOT portal CTA */}
      <Card className="mt-6 p-5 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Explore the Full iGOT Karmayogi Course Directory</p>
              <p className="text-xs text-neutral-600 mt-0.5">
                The official platform contains thousands of specialized training courses for civil servants across Indian ministries and departments.
              </p>
            </div>
          </div>
          <a
            href={IGOT_COURSE_LIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Globe size={14} />
            Open iGOT Course List
            <ExternalLink size={13} />
          </a>
        </div>
      </Card>

      {/* Toast notification */}
      {enrollToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-success-400" />
          {enrollToast}
        </div>
      )}
    </>
  );
}
