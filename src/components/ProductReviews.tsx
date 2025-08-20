import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  averageRating,
  totalReviews
}) => {
  const { state: authState } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Marie Dubois',
      userAvatar: 'https://ui-avatars.com/api/?name=Marie+Dubois&background=007bff&color=fff',
      rating: 5,
      comment: 'Excellent produit ! La qualité est au rendez-vous et la livraison a été rapide. Je recommande vivement.',
      createdAt: new Date('2024-01-15'),
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'Pierre Martin',
      userAvatar: 'https://ui-avatars.com/api/?name=Pierre+Martin&background=28a745&color=fff',
      rating: 4,
      comment: 'Très bon rapport qualité-prix. Le produit correspond exactement à la description.',
      createdAt: new Date('2024-01-10'),
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      userId: '3',
      userName: 'Sophie Laurent',
      userAvatar: 'https://ui-avatars.com/api/?name=Sophie+Laurent&background=dc3545&color=fff',
      rating: 5,
      comment: 'Je suis très satisfaite de mon achat. Le design est moderne et la fonctionnalité parfaite.',
      createdAt: new Date('2024-01-08'),
      helpful: 15,
      verified: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadReviews = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReviews(mockReviews);
      setLoading(false);
    };

    loadReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated) {
      alert('Vous devez être connecté pour laisser un avis');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const review: Review = {
        id: Date.now().toString(),
        userId: authState.user!.id,
        userName: `${authState.user!.firstName} ${authState.user!.lastName}`,
        userAvatar: authState.user!.avatar,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date(),
        helpful: 0,
        verified: true
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      
    } catch (error) {
      alert('Erreur lors de l\'envoi de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="reviews-section">
        <h3>Avis clients</h3>
        <div className="loading">Chargement des avis...</div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Avis clients</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            {renderStars(Math.round(averageRating))}
            <span className="rating-text">
              {averageRating.toFixed(1)} sur 5 ({totalReviews} avis)
            </span>
          </div>
          
          {authState.isAuthenticated && (
            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Annuler' : 'Écrire un avis'}
            </button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h4>Votre avis</h4>
          
          <div className="form-group">
            <label>Note :</label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="comment">Commentaire :</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Partagez votre expérience avec ce produit..."
              required
              rows={4}
            />
          </div>
          
          <button
            type="submit"
            className="submit-review-btn"
            disabled={submitting || !newReview.comment.trim()}
          >
            {submitting ? 'Envoi en cours...' : 'Publier l\'avis'}
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">Aucun avis pour ce produit.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="reviewer-avatar"
                  />
                  <div>
                    <span className="reviewer-name">
                      {review.userName}
                      {review.verified && <span className="verified-badge">✓ Achat vérifié</span>}
                    </span>
                    <div className="review-meta">
                      {renderStars(review.rating)}
                      <span className="review-date">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="review-content">
                <p>{review.comment}</p>
              </div>
              
              <div className="review-actions">
                <button className="helpful-btn">
                  👍 Utile ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
