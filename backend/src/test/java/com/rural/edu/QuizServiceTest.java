package com.rural.edu;

import com.rural.edu.entity.Question;
import com.rural.edu.entity.Quiz;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class QuizServiceTest {

    @Test
    public void testQuizScoring_BackendCalculation() {
        Quiz quiz = new Quiz(null, "Math Quiz", 20, 15);
        
        Question q1 = new Question(quiz, "2 + 2 = ?", "3", "4", "5", "6", "B", 10);
        q1.setId(101L);
        Question q2 = new Question(quiz, "5 * 5 = ?", "20", "25", "30", "35", "B", 10);
        q2.setId(102L);

        List<Question> questions = Arrays.asList(q1, q2);

        Map<Long, String> studentAnswers = new HashMap<>();
        studentAnswers.put(101L, "B"); // Correct
        studentAnswers.put(102L, "A"); // Incorrect

        int correctCount = 0;
        int totalScore = 0;

        for (Question q : questions) {
            String selectedOption = studentAnswers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
                totalScore += q.getPoints();
            }
        }

        assertEquals(1, correctCount);
        assertEquals(10, totalScore);
    }
}
