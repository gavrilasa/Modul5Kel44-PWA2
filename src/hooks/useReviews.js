// src/hooks/useReviews.js
import { useState, useEffect, useCallback } from "react";
import reviewService from "../services/reviewService";
import { getUserIdentifier } from "./useFavorites"; // Import user identifier

/**
 * Custom hook for fetching reviews for a specific recipe
 * @param {string} recipeId Recipe ID
 * @returns {Object} { reviews, loading, error, refetch }
 */
export function useReviews(recipeId) {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchReviews = useCallback(async () => {
		if (!recipeId) {
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			setError(null);
			const response = await reviewService.getReviews(recipeId);
			if (response.success) {
				setReviews(response.data || []);
			} else {
				setError(response.message || "Failed to fetch reviews");
			}
		} catch (err) {
			setError(err.message || "An error occurred while fetching reviews");
			setReviews([]);
		} finally {
			setLoading(false);
		}
	}, [recipeId]);

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	return { reviews, loading, error, refetch: fetchReviews };
}

/**
 * Custom hook for fetching all reviews by the current user
 * @returns {Object} { myReviews, loading, error, refetch }
 */
export function useReviewsByUser() {
	const [myReviews, setMyReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const userIdentifier = getUserIdentifier();

	const fetchUserReviews = useCallback(async () => {
		if (!userIdentifier) {
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			setError(null);
			const response = await reviewService.getReviewsByUser(userIdentifier);
			if (response.success) {
				// Pastikan backend mengembalikan nama resep bersama ulasan
				setMyReviews(response.data || []);
			} else {
				setError(response.message || "Failed to fetch user reviews");
			}
		} catch (err) {
			setError(err.message || "An error occurred while fetching user reviews");
			setMyReviews([]);
		} finally {
			setLoading(false);
		}
	}, [userIdentifier]);

	useEffect(() => {
		fetchUserReviews();
	}, [fetchUserReviews]);

	return { myReviews, loading, error, refetch: fetchUserReviews };
}

/**
 * Custom hook for creating a review
 * @returns {Object} { createReview, loading, error, success }
 */
export function useCreateReview() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const createReview = async (recipeId, reviewData) => {
		try {
			setLoading(true);
			setError(null);
			setSuccess(false);
			const response = await reviewService.createReview(recipeId, reviewData);
			if (response.success) {
				setSuccess(true);
				return response;
			} else {
				setError(response.message || "Failed to create review");
				return null;
			}
		} catch (err) {
			setError(err.message || "An error occurred while creating review");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { createReview, loading, error, success };
}
