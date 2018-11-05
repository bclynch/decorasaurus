import { gateway as MoltinGateway } from '@moltin/sdk';
import { Observable } from 'rxjs';
import { MoltinProduct } from './models/product';
import { MoltinProducts } from './models/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MoltinCart, MoltinCartItem, MoltinCartResp } from './models/cart';
import { MoltinOrder } from './models/order';

import { ENV } from '../../../environments/environment';
import { MoltinAddress } from './models/customer';

@Injectable()
export class Moltin {
	private moltin = MoltinGateway({
		client_id: ENV.moltinClientId,
		client_secret: ENV.moltinClientSecret
	});

	constructor(public httpClient: HttpClient) {

	}

	getAddresses(customerId: string, customerToken: string): Observable<MoltinAddress[]> {
		return new Observable<MoltinAddress[]>(observer => {
			this.moltin.Addresses.All({
				customer: customerId,
				token: customerToken
			}).then(data => {
				observer.next(data.data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
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

	addToCart(ref: string, product: MoltinProduct): Observable<any> {
		return new Observable<MoltinProduct>(observer => {
			this.moltin.Cart(ref).AddProduct(product.id).then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	addCustomToCart(ref: string, product: any): Observable<any> {
		return new Observable<MoltinProduct>(observer => {
			this.moltin.Cart(ref).AddCustomItem(product).then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	getCart(ref: string): Observable<MoltinCart> {
		return new Observable<MoltinCart>(observer => {
			this.moltin.Cart(ref).Get().then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	getCartItems(ref: string): Observable<MoltinCartResp> {
		return new Observable<MoltinCartResp>(observer => {
			this.moltin.Cart(ref).Items().then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	updateCartItem(ref: string, itemID, quantity): Observable<MoltinCartResp> {
			return new Observable<MoltinCartResp>(observer => {
					this.moltin.Cart(ref).UpdateItemQuantity(itemID, quantity).then((data) => {
							observer.next(data);
							observer.complete();
					}).catch(error => {
							observer.error(error);
							observer.complete();
					});
			});
	}

	deleteCartItem(ref: string, itemID): Observable<MoltinCartResp> {
			return new Observable<MoltinCartResp>(observer => {
					this.moltin.Cart(ref).RemoveItem(itemID).then((data) => {
							observer.next(data);
							observer.complete();
					}).catch(error => {
							observer.error(error);
							observer.complete();
					});
			});
	}

	applyPromoCode(ref: string, promoCode): Observable<any> {
		return new Observable(observer => {
			this.moltin.Cart(ref).AddPromotion(promoCode).then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	checkoutCart(ref: string, customer, billingAddress, shippingAddress): Observable<MoltinOrder> {
		return new Observable<MoltinOrder>(observer => {
			this.moltin.Cart(ref).Checkout(customer, billingAddress, shippingAddress).then((data) => {
				observer.next(data['data']);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	deleteCart(ref: string): Observable<any> {
		return new Observable(observer => {
			this.moltin.Cart(ref).Delete().then(data => {
				observer.next(data);
				observer.complete();
			}).catch(error => {
				observer.error(error);
				observer.complete();
			});
		});
	}

	payForOrder(order: MoltinOrder, source: string) {
			const payload = {
					'gateway': 'stripe',
					'method': 'purchase',
					'payment': source,
					'options': {
							receipt_email: 'bclynch7@gmail.com'
					}
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

	getCustomerOrders(customerId: string) {
		return this.moltin.Orders.Filter({ eq: { customer_id: customerId } }).All();
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
