package com.rural.edu;

import com.rural.edu.entity.Question;
import com.rural.edu.entity.Quiz;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class QuizServiceTest {

    private Quiz quiz;
    private Question q1;
    private Question q2;
    private Question q3;
    private List<Question> questions;

    @BeforeEach
    public void setUp() {
        quiz = new Quiz(null, "Science Quiz", 30, 20); // Total 30 marks
        
        q1 = new Question(quiz, "What is the capital of India?", "Mumbai", "New Delhi", "Kolkata", "Chennai", "B", 10);
        q1.setId(101L);

        q2 = new Question(quiz, "What is H2O?", "Water", "Gas", "Acid", "Base", "A", 10);
        q2.setId(102L);

        q3 = new Question(quiz, "Speed of light is faster than sound?", "True", "False", "Both", "None", "A", 10);
        q3.setId(103L);

        questions = Arrays.asList(q1, q2, q3);
    }

    @Test
    public void testQuizScoring_AllCorrect() {
        Map<Long, String> answers = new HashMap<>();
        answers.put(101L, "B");
        answers.put(102L, "A");
        answers.put(103L, "A");

        int correctCount = 0;
        int totalScore = 0;

        for (Question q : questions) {
            String selectedOption = answers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
                totalScore += q.getPoints();
            }
        }

        assertEquals(3, correctCount);
        assertEquals(30, totalScore);
        assertEquals(quiz.getTotalMarks(), totalScore, "Score of 30 matches quiz total marks of 30");
    }

    @Test
    public void testQuizScoring_PartialCorrect() {
        Map<Long, String> answers = new HashMap<>();
        answers.put(101L, "B"); // Correct (10 pts)
        answers.put(102L, "C"); // Incorrect
        answers.put(103L, "B"); // Incorrect

        int correctCount = 0;
        int totalScore = 0;

        for (Question q : questions) {
            String selectedOption = answers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
                totalScore += q.getPoints();
            }
        }

        assertEquals(1, correctCount);
        assertEquals(10, totalScore);
        assertTrue(totalScore < quiz.getTotalMarks(), "Partial score of 10 is less than total marks 30");
    }

    @Test
    public void testQuizScoring_EmptySubmission() {
        Map<Long, String> answers = new HashMap<>();

        int correctCount = 0;
        int totalScore = 0;

        for (Question q : questions) {
            String selectedOption = answers.get(q.getId());
            if (selectedOption != null && selectedOption.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
                totalScore += q.getPoints();
            }
        }

        assertEquals(0, correctCount);
        assertEquals(0, totalScore);
    }
}
