package com.rural.edu;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ProgressServiceTest {

    @Test
    public void testProgressCalculationFormula() {
        long totalActivities = 10;
        long completedActivities = 7;

        int percentage = (int) Math.min(100, Math.round(((double) completedActivities / totalActivities) * 100.0));

        assertEquals(70, percentage, "Progress percentage must equal (completed / total) * 100");
    }
}
