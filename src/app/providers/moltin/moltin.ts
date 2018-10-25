import { gateway as MoltinGateway } from '@moltin/sdk';
import { Observable } from 'rxjs';
import { MoltinProduct } from './models/product';
import { MoltinProducts } from './models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MoltinCart } from './models/cart';
import { MoltinOrder } from './models/order';

import { ENV } from '../../../environments/environment';

@Injectable()
export class Moltin {
    private moltin = MoltinGateway({
    	client_id: ENV.moltinClientId
    });

    constructor(public httpClient: HttpClient) {

    }

    // get all Products
    getProducts(): Promise<MoltinProducts> {
			const request = this.moltin.Products.With(['main_image', 'categories']);
			return request.All().then((products) => {
				const product = products.data[0];
				if (!product) {
					throw {'error': 'No product found'};
				}
				// pass on to the next one
				return products;
			});
		}

    getProduct(sku: string): Observable<MoltinProduct> {
			return new Observable<MoltinProduct>(observer => {
				let request = this.moltin.Products.With(['main_image', 'files', 'categories']);
				request = request.Filter({
					eq: {
						'sku': sku
					}
				});
				request.All().then((products) => {
					const product = products.data[0];
					if (!product) {
						observer.error({'error': 'No product found'});
						observer.complete();
						return;
					}
					return [ product, products.included ];
				}).then(data => {
					let product = data[0];
					const included = data[1];
					product = this.rollUpSingleRelationship(product, 'main_image', included, 'main_images');
					product = this.rollUpManyRelationship(product, 'categories', included, 'categories');
					product = this.rollUpManyRelationship(product, 'files', included, 'files');
					return product;
				}).then(data => {
					observer.next(data);
					observer.complete();
				}).catch(error => {
					observer.error(error);
					observer.complete();
				});
			});
    }

    getProductById(id: string): Observable<MoltinProduct> {
        return new Observable<MoltinProduct>(observer => {
            const request = this.moltin.Products.With(['main_image', 'files', 'categories']);
            request.Get(id).then((data) => {
                const product = data.data;
                if (!product) {
                    observer.error({'error': 'No product found'});
                    observer.complete();
                    return;
                }
                return [ product, data.included ];
            }).then(data => {
                let product = data[0];
                const included = data[1];
                product = this.rollUpSingleRelationship(product, 'main_image', included, 'main_images');
                product = this.rollUpManyRelationship(product, 'categories', included, 'categories');
                product = this.rollUpManyRelationship(product, 'files', included, 'files');
                return product;
            }).then(data => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    addToCart(product: MoltinProduct): Observable<any> {
        return new Observable<MoltinProduct>(observer => {
            this.moltin.Cart().AddProduct(product.id).then(data => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    getCart(): Observable<MoltinCart> {
        return new Observable<MoltinCart>(observer => {
            this.moltin.Cart().Items().then(data => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    updateCartItem(itemID, quantity): Observable<MoltinCart> {
        return new Observable<MoltinCart>(observer => {
            this.moltin.Cart().UpdateItemQuantity(itemID, quantity).then((data) => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    deleteCartItem(itemID): Observable<MoltinCart> {
        return new Observable<MoltinCart>(observer => {
            this.moltin.Cart().RemoveItem(itemID).then((data) => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    applyPromoCode(promoCode): Observable<any> {
        return new Observable(observer => {
            this.moltin.Cart().AddPromotion(promoCode).then(data => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    checkoutCart(customer, billingAddress, shippingAddress): Observable<MoltinOrder> {
        return new Observable<MoltinOrder>(observer => {
            this.moltin.Cart().Checkout(customer, billingAddress, shippingAddress).then((data) => {
                observer.next(data['data']);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    deleteCart(): Observable<any> {
        return new Observable(observer => {
            this.moltin.Cart().Delete().then(data => {
                observer.next(data);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    payForOrder(order: MoltinOrder, token) {
        const payload = {
            'gateway': 'stripe',
            'method': 'purchase',
            'payment': token
        };
        return new Observable<MoltinOrder>(observer => {
            this.moltin.Orders.Payment(order.id, payload).then((data) => {
                observer.next(data['data']);
                observer.complete();
            }).catch(error => {
                observer.error(error);
                observer.complete();
            });
        });
    }

    private rollUpSingleRelationship(item, key, included, included_key) {
        // vloop through an array
        const includes = included[included_key] || [];
        const relationship = item.relationships[key];
        if (!relationship) { return item; }
        const relationship_id = relationship.data.id;
        item[key] = includes.find(x => x.id === relationship_id);
        return item;
    }

    private rollUpManyRelationship(item, key, included, included_key) {
        const includes = included[included_key] || [];
        const relationship = item.relationships[key];
        if (!relationship) { return item; }
        const relationship_ids = relationship.data.map(relItem => relItem.id);
        item[key] = includes.map(x => {
            return relationship_ids.indexOf(x.id) !== -1 ? x : null;
        }).filter(x => x != null);
        return item;
    }
}
