'use client'
import LeftSide from '@/components/products/left-side'
import { StarIcon } from 'lucide-react'
import { AiFillHeart, AiFillStar } from 'react-icons/ai'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/bread-crumbz'
import useCartStore from '@/store/cart-store'
import Spinner from '@/components/spinner'
import { usePathname, useRouter, useParams } from 'next/navigation'
import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MoreInfo from './more-info'
import { toast } from '@/components/ui/toast'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

const product = {
    id: '1',
    name: 'Basic Tee 6-Pack ',
    description: 'These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they’ll withstand everything the weather can offer.',
    price: '192',
    rating: 3.9,
    reviewCount: 117,
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg',
    imageAlt: 'Two each of gray, white, and black shirts arranged on table.',
    colors: [
        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
    ],
    sizes: [
        { name: 'XXS', inStock: true },
        { name: 'XS', inStock: true },
        { name: 'S', inStock: true },
        { name: 'M', inStock: true },
        { name: 'L', inStock: true },
        { name: 'XL', inStock: true },
        { name: 'XXL', inStock: true },
        { name: 'XXXL', inStock: false },
    ],
}
const features = [
    { name: 'Origin', description: 'Designed by Good Goods, Inc.' },
    { name: 'Material', description: 'Solid walnut base with rare earth magnets and powder coated steel card cover' },
    { name: 'Dimensions', description: '6.25" x 3.55" x 1.15"' },
    { name: 'Finish', description: 'Hand sanded and finished with natural oil' },
    { name: 'Includes', description: 'Wood card tray and 3 refill packs' },
    { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
]


function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    rating: number;
    reviewCount: number;
    href: string;
    imageSrc: string;
    imageAlt: string;
    colors: Array<{ name: string; class: string; selectedClass: string }>;
    sizes: Array<{ name: string; inStock: boolean }>;
}

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
}

interface IndividualProductProps {
    product: Product;
}
const IndividualProduct: React.FC<IndividualProductProps> = ({ product }) => {
    const [selectedColor, setSelectedColor] = useState(product.colors[0].name)
    const [selectedSize, setSelectedSize] = useState(product.sizes[0].name)

    const [reviewText, setReviewText] = useState('');
    const [reviewBody, setReviewBody] = useState('');
    const [stars, setStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);

    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'John Doe',
            rating: 4,
            comment: 'Great product, I love it!',
        },
        {
            id: 2,
            name: 'Jane Smith',
            rating: 5,
            comment: 'Excellent quality and fast shipping!',
        },
        {
            id: 3,
            name: 'Lisa Jones',
            rating: 3,
            comment: 'It was just ok, nothing special.',
        },
        {
            id: 4,
            name: 'Mike Lee',
            rating: 4,
            comment: 'I love this product, would buy again!',
        },
    ]);

    const averageRating = () => {
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return totalRating / reviews.length;
    }


    const handleEditClick = (reviewId: String) => {
        const review = reviews.find(review => review._id === reviewId);

    };

    const handleCancelEdit = () => {
        setReviewText('');
        setReviewBody('');
        setStars(0);
    };

    const handleUpdateReview = async (reviewId: String) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: reviewText,
                    content: reviewBody,
                    rating: stars,
                })
            });

            if (response.ok) {
                console.log('Review updated successfully');
                setReviewText('');
                setReviewBody('');
                setStars(0);
                toast({
                    title: 'Review updated successfully',
                    description: 'Your review has been updated successfully',
                })
                setReviews(reviews.map(review => {
                    if (review._id === reviewId) {
                        return {
                            ...review,
                            title: reviewText,
                            content: reviewBody,
                            rating: stars
                        };
                    }
                    return review;
                }
                ));

            } else {
                console.error('Error updating review:', response.statusText);
                toast({
                    title: 'Error',
                    description: 'Error updating review',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            console.error('Error updating review:', error);
            toast({
                title: 'Error',
                description: 'Error updating review',
                variant: 'destructive'
            })
        }
    };

    const handleDeleteReview = async (reviewId:String) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Review deleted successfully');
                const updatedReviews = reviews.filter(review => review._id !== reviewId);
                setReviews(updatedReviews);
                toast({
                    title: 'Review deleted successfully',
                    description: 'Your review has been deleted successfully',
                })
            } else {
                console.error('Error deleting review:', response.statusText);
                toast({
                    title: 'Error',
                    description: 'Error deleting review',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast({
                title: 'Error',
                description: 'Error deleting review',
                variant: 'destructive'
            })
        }
    };

    const handleStarClick = (star: String) => {
        // @ts-ignore
        setStars(star);
    };
    const handleStarHover = (star: String) => {
        // @ts-ignore
        setHoveredStars(star);
    };



    const { addToCart, itemAlreadyInCart, removeFromCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        // @ts-ignore
        addToCart(product)
        setIsLoading(false)
    }


    const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        // @ts-ignore

        addToCart(product);
        setIsLoading(false);
    }

    const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        // @ts-ignore
        removeFromCart(product);
        setIsLoading(false);
    }


    return (
        <div className="relative flex w-full items-center overflow-hidden bg-white dark:bg-black px-4 pb-8 pt-14  sm:px-6 sm:pt-8 md:p-6 lg:p-8">

            <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="aspect-h-2 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 sm:col-span-4 lg:col-span-5">
                    <Image
                        width={500}
                        height={500}
                        onError={(e) => {
                            // @ts-ignore
                            e.target.src = 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg';
                        }}
                        src={product.imageSrc[0]} alt={product.imageAlt} className="object-cover object-center w-full h-full"
                    />

                </div>


                <div className="sm:col-span-8 lg:col-span-7">
                    <span className=" text-[#a445ed] font-bold uppercase text-xs tracking-wider">
                        Tejas Company
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 sm:pr-12">{product.name}</h2>

                    <section aria-labelledby="information-heading" className="mt-2">
                        <h3 id="information-heading" className="sr-only">
                            Product information
                        </h3>

                        <p className=" text-gray-800 md:text-lg">{product.description}</p>

                        <div className="font-bold flex justify-between md:flex-col">
                            <p className="flex gap-3 text-2xl items-center md:text-3xl">
                                ₹{product.price}.00
                                <span className="text-base text-purple-500 bg-purple-300 px-1.5 rounded-md">
                                    off
                                </span>
                            </p>
                            <span className="text-gray-300 line-through">200.00</span>
                        </div>
                        {/* Reviews */}
                        <div className="mt-6">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <AiFillStar
                                            key={rating}
                                            className={classNames(
                                                product.rating > rating ? 'text-yellow-500' : 'text-gray-200',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{product.rating} out of 5 stars</p>
                                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                    {product.reviewCount} reviews
                                </a>
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="options-heading" className="mt-10">
                        <h3 id="options-heading" className="sr-only">
                            Product options
                        </h3>

                        <form>
                            {/* Colors */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Color</h4>

                                <div
                                    className="mt-4">
                                    <Label className="sr-only">Choose a color</Label>
                                    <span className="flex items-center space-x-3">
                                        {product.colors.map((color) => (
                                            <div
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={classNames(
                                                    color.name,
                                                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                                                )}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div id={`color-${color.name}`} />
                                                    <span
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            color.class,
                                                            'h-8 w-8 rounded-full border border-black border-opacity-10',
                                                            selectedColor === color.name ? 'ring ring-offset-1' : '',
                                                        )}
                                                    />
                                                    <Label htmlFor={`color-${color.name}`}>
                                                        {color.name}
                                                    </Label>
                                                </div>
                                            </div>
                                        ))}

                                    </span>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mt-10">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Size</h4>
                                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Size guide
                                    </a>
                                </div>

                                <div className='grid grid-cols-4 gap-4 mt-4'>
                                    {
                                        product.sizes.map((size) => (
                                            <div key={size.name}
                                                onClick={() => setSelectedSize(size.name)}
                                                className={classNames(
                                                    size.inStock
                                                        ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                                        : 'cursor-not-allowed bg-gray-50 text-gray-200',
                                                    selectedSize === size.name ? 'ring-2 ring-indigo-500' : '',
                                                    'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                )}
                                            >
                                                <Label>{size.name}</Label>
                                                {size.inStock ? (
                                                    <span
                                                        className={classNames(
                                                            selectedSize === size.name ? 'border' : 'border-2',
                                                            selectedSize === size.name ? 'border-indigo-500' : 'border-transparent',
                                                            'pointer-events-none absolute -inset-px rounded-md'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <span
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                                    >
                                                        <svg
                                                            className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                                            viewBox="0 0 100 100"
                                                            preserveAspectRatio="none"
                                                            stroke="currentColor"
                                                        >
                                                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className='
              flex gap-4 mt-10
              '>
                                {itemAlreadyInCart(product) ? (
                                    <Button className="mt-2 flex justify-between w-1/2">
                                        <span onClick={handleIncrement}>+</span>
                                        <span>{useCartStore.getState().items.find(item => item.id === product.id)?.quantity}</span>
                                        <span onClick={handleDecrement}>-</span>
                                    </Button>
                                ) : (
                                    <Button className='mt-4 w-1/2' onClick={handleAddToCart}>
                                        {isLoading ? 'Adding...' : 'Add to Cart'}
                                    </Button>
                                )}
                                <Button onClick={handleAddToCart}
                                    className='w-1/2'
                                    variant={'outline'}
                                >
                                    <AiFillHeart className='mr-2' />
                                    Add to Wishlist
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>
                {/* more info */}
                <MoreInfo data={features} />

                {/* review */}
                {
                    true && (
                        <>
                            <div className='
                col-span-12 flex flex-col gap-4
                            '>
                                <div className='flex gap-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => handleStarHover(star)}
                                            onMouseLeave={() => handleStarHover(0)}
                                            onClick={() => handleStarClick(star)}
                                            className={`text-2xl ${(hoveredStars >= star || stars >= star) ? 'text-yellow-400' : 'text-gray-300'
                                                } cursor-pointer`}
                                        >
                                            &#9733;
                                        </button>
                                    ))}
                                </div>
                                <Input placeholder='Enter your review'
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <Textarea placeholder='Enter your review'
                                    value={reviewBody}
                                    onChange={(e) => setReviewBody(e.target.value)}
                                />
                                <Button
                                // onClick={handleReviewSubmit}
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </>
                    )}
                <div className="p-4 rounded  col-span-12">
                    <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

                    <div className="mb-4">
                        <span className="text-xl font-bold">Average Rating:</span>
                        <span className="ml-2">{averageRating().toFixed(1)}</span>
                    </div>

                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="border p-4 rounded">
                                <div className="flex justify-between mb-2">
                                    <div className='flex gap-3 items-center'>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold">{review.name}</span>
                                    </div>
                                    <span className={`text-${review.rating >= 4 ? 'green' : 'red'}-500`}>
                                        {review.rating} stars
                                    </span>
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {reviews.length > 3 && (
                        <div className="mt-4 text-center">
                            <button className="text-blue-600 hover:underline">View All Reviews</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}



export default IndividualProduct