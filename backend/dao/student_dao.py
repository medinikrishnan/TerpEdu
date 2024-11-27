import dao

class StudentDao:
    def enroll_in_course(self, user_id, course_id):
        sql_check = "SELECT COUNT(*) FROM stu_enrollments WHERE user_id = ?;"
        result = dao.execute_query(sql_check, (user_id,), fetch=True)
        if result[0][0] >= 3:
            raise Exception("Student cannot enroll in more than 3 courses.")

        sql_insert = "INSERT INTO stu_enrollments (user_id, course_id) VALUES (?, ?);"
        dao.execute_query(sql_insert, (user_id, course_id))

    def drop_course(self, user_id, course_id):
        sql = "DELETE FROM stu_enrollments WHERE user_id = ? AND course_id = ?;"
        dao.execute_query(sql, (user_id, course_id))

    def get_enrolled_courses(self, user_id):
        sql = """
        SELECT c.course_id, c.course_name
        FROM stu_enrollments e
        JOIN courses c ON e.course_id = c.course_id
        WHERE e.user_id = ?;
        """
        return dao.execute_query(sql, (user_id,), fetch=True)

    def get_available_courses(self, user_id):
        sql = """
        SELECT course_id, course_name
        FROM courses
        WHERE course_id NOT IN (
            SELECT course_id FROM stu_enrollments WHERE user_id = ?
        ) AND is_currently_active = 1;
        """
        return dao.execute_query(sql, (user_id,), fetch=True)
