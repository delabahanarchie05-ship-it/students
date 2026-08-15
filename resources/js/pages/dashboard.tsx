import { Head, useForm } from '@inertiajs/react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { dashboard } from '@/routes';
import React, { useEffect, useState } from 'react';

type Student = {
    id: string;
    student_id: string;
    full_name: string;
    gender: string;
    date_of_birth: string;
    year_level: string;
    section: string;
    contact_number: string;
};

export default function Dashboard({ students: initialStudents }: { students?: Student[] }) {
    const form = useForm({
        student_id: '',
        full_name: '',
        gender: '',
        date_of_birth: '',
        year_level: '',
        section: '',
        contact_number: '',
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [studentList, setStudentList] = useState<Student[]>(initialStudents ?? []);

    useEffect(() => {
        const studentsRef = collection(db, 'students');
        const studentsQuery = query(studentsRef, orderBy('student_id'));

        const unsubscribe = onSnapshot(
            studentsQuery,
            (snapshot) => {
                const students = snapshot.docs.map((studentDoc) => ({
                    id: studentDoc.id,
                    ...(studentDoc.data() as Omit<Student, 'id'>),
                }));

                setStudentList(students);
            },
            (error) => {
                console.error('Failed to fetch students from Firestore:', error);
            },
        );

        return () => unsubscribe();
    }, []);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const payload = {
            student_id: form.data.student_id.trim(),
            full_name: form.data.full_name.trim(),
            gender: form.data.gender,
            date_of_birth: form.data.date_of_birth,
            year_level: form.data.year_level.trim(),
            section: form.data.section.trim(),
            contact_number: form.data.contact_number.trim(),
        };

        if (!payload.student_id) {
            form.setError('student_id', 'Student ID is required.');
            return;
        }

        if (!payload.full_name) {
            form.setError('full_name', 'Full name is required.');
            return;
        }

        if (!payload.gender) {
            form.setError('gender', 'Gender is required.');
            return;
        }

        if (!payload.date_of_birth) {
            form.setError('date_of_birth', 'Date of birth is required.');
            return;
        }

        if (!payload.year_level) {
            form.setError('year_level', 'Year level is required.');
            return;
        }

        if (!payload.section) {
            form.setError('section', 'Section is required.');
            return;
        }

        if (!payload.contact_number) {
            form.setError('contact_number', 'Contact number is required.');
            return;
        }

        try {
            if (selectedId) {
                await updateDoc(doc(db, 'students', selectedId), payload);
            } else {
                await addDoc(collection(db, 'students'), payload);
            }

            form.reset();
            setSelectedId(null);
        } catch (error) {
            console.error('Failed to save student to Firestore:', error);
            form.setError('student_id', 'Unable to save student record to Firestore.');
        }
    }

    function editStudent(s: Student) {
        form.setData('student_id', s.student_id);
        form.setData('full_name', s.full_name);
        form.setData('gender', s.gender);
        form.setData('date_of_birth', s.date_of_birth);
        form.setData('year_level', s.year_level);
        form.setData('section', s.section);
        form.setData('contact_number', s.contact_number);
        setSelectedId(s.id);
    }

    function cancelEdit() {
        form.reset();
        setSelectedId(null);
    }

    async function deleteStudent(id: string) {
        if (!confirm('Delete this student?')) return;

        try {
            await deleteDoc(doc(db, 'students', id));
        } catch (error) {
            console.error('Failed to delete student from Firestore:', error);
        }
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-xl font-semibold">Student Records</h1>
                    <p className="text-sm text-muted-foreground">
                        Add, update, or remove student records.
                    </p>
                </div>

                <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-xl border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="student_id" className="text-sm font-medium">
                                Student ID
                            </label>
                            <Input
                                id="student_id"
                                value={form.data.student_id}
                                onChange={(e) => form.setData('student_id', e.target.value)}
                                placeholder="School I.D. Number"
                            />
                            {form.errors.student_id && (
                                <p className="text-sm text-red-600">{form.errors.student_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="full_name" className="text-sm font-medium">
                                Full Name
                            </label>
                            <Input
                                id="full_name"
                                value={form.data.full_name}
                                onChange={(e) => form.setData('full_name', e.target.value)}
                                placeholder="Juan Dela Cruz"
                            />
                            {form.errors.full_name && (
                                <p className="text-sm text-red-600">{form.errors.full_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium">
                                Gender
                            </label>
                            <select
                                id="gender"
                                value={form.data.gender}
                                onChange={(e) => form.setData('gender', e.target.value)}
                                className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {form.errors.gender && (
                                <p className="text-sm text-red-600">{form.errors.gender}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="date_of_birth" className="text-sm font-medium">
                                Date of Birth
                            </label>
                            <Input
                                id="date_of_birth"
                                type="date"
                                value={form.data.date_of_birth}
                                onChange={(e) => form.setData('date_of_birth', e.target.value)}
                            />
                            {form.errors.date_of_birth && (
                                <p className="text-sm text-red-600">{form.errors.date_of_birth}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="year_level" className="text-sm font-medium">
                                Grade / Year Level
                            </label>
                            <Input
                                id="year_level"
                                value={form.data.year_level}
                                onChange={(e) => form.setData('year_level', e.target.value)}
                                placeholder="Grade 10 / 4th Year"
                            />
                            {form.errors.year_level && (
                                <p className="text-sm text-red-600">{form.errors.year_level}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="section" className="text-sm font-medium">
                                Section/Course
                            </label>
                            <Input
                                id="section"
                                value={form.data.section}
                                onChange={(e) => form.setData('section', e.target.value)}
                                placeholder="Section A/BSIT/EMC/BSBA/BSHRM"
                            />
                            {form.errors.section && (
                                <p className="text-sm text-red-600">{form.errors.section}</p>
                            )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="contact_number" className="text-sm font-medium">
                                Contact Number
                            </label>
                            <Input
                                id="contact_number"
                                value={form.data.contact_number}
                                onChange={(e) => form.setData('contact_number', e.target.value)}
                                placeholder="09XXXXXXXXX"
                            />
                            {form.errors.contact_number && (
                                <p className="text-sm text-red-600">{form.errors.contact_number}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            {selectedId ? 'Update Student' : 'Save Student'}
                        </Button>
                        {selectedId && (
                            <Button type="button" variant="secondary" onClick={cancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                <div>
                    <h2 className="text-lg font-medium">Students List</h2>
                    <div className="mt-2 space-y-2">
                        {studentList.map((s) => (
                            <div
                                key={s.id}
                                className="flex flex-col justify-between gap-2 rounded border p-3 sm:flex-row sm:items-center"
                            >
                                <div>
                                    <div className="font-semibold">{s.full_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {s.student_id} • {s.gender} • {s.year_level} - {s.section}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        DOB: {s.date_of_birth} • {s.contact_number}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => editStudent(s)}>
                                        Update
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deleteStudent(s.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {studentList.length === 0 && (
                            <div className="text-sm text-muted-foreground">No students yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};