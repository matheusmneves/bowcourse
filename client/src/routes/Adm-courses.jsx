import React from 'react';

function AdminCourses() {
  const courses = [
    { name: 'Creative Coding Workshop', term: 'Spring', code: 'CM0101' },
    { name: 'Full-Stack Web Development', term: 'Summer', code: 'DS0606' }
  ];

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>{course.name} - {course.term} - {course.code}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCourses;