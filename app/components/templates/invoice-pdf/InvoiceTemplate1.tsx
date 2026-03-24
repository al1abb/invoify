import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate = (data: InvoiceType) => {
	const { sender, receiver, details } = data;

	// Check if discount and tax are used
	const hasDiscount = details.items.some(item => item.discount && item.discount > 0);
	const hasTax = details.items.some(item => item.tax && item.tax > 0);
	const colCount = 5 + (hasDiscount ? 1 : 0) + (hasTax ? 1 : 0);
	const gridClass = colCount === 5 ? 'sm:grid-cols-5' : colCount === 6 ? 'sm:grid-cols-6' : 'sm:grid-cols-7';

	return (
		<InvoiceLayout data={data}>
			<div className='flex justify-between'>
				<div>
					{details.invoiceLogo && (
						<img
							src={details.invoiceLogo}
							width={140}
							height={100}
							alt={`Logo of ${sender.name}`}
						/>
					)}
					<h1 className='mt-2 text-lg md:text-xl font-semibold text-blue-600'>{sender.name}</h1>
				</div>
				<div className='text-right'>
					<h2 className='text-2xl md:text-3xl font-semibold text-gray-800'>Invoice #</h2>
					<span className='mt-1 block text-gray-500'>{details.invoiceNumber}</span>
					<address className='mt-4 not-italic text-gray-800 text-sm'>
						{[sender.address, sender.zipCode, sender.city, sender.country]
							.filter(Boolean)
							.map((part, index, arr) => (
								<React.Fragment key={index}>
									{part}
									{index < arr.length - 1 && <br />}
								</React.Fragment>
							))}
					</address>
				</div>
			</div>

			<div className='mt-6 grid sm:grid-cols-2 gap-3'>
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>Bill to:</h3>
					<h3 className='text-lg font-semibold text-gray-800'>{receiver.name}</h3>
					<address className='mt-2 not-italic text-gray-500'>
						{[receiver.address, receiver.zipCode, receiver.city, receiver.country]
							.filter(Boolean)
							.map((part, index, arr) => (
								<React.Fragment key={index}>
									{part}
									{index < arr.length - 1 && <br />}
								</React.Fragment>
							))}
					</address>
				</div>
				<div className='sm:text-right space-y-2'>
					<div className='grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2'>
						<dl className='grid sm:grid-cols-6 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Invoice date:</dt>
							<dd className='col-span-3 text-gray-500'>
								{new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
							</dd>
						</dl>
						<dl className='grid sm:grid-cols-6 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Due date:</dt>
							<dd className='col-span-3 text-gray-500'>
								{new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
							</dd>
						</dl>
					</div>
				</div>
			</div>

			<div className='mt-3'>
				<div className='border border-gray-200 p-1 rounded-lg space-y-1'>
					<div className={`hidden sm:grid ${gridClass} gap-x-2`}>
						<div className='sm:col-span-2 text-xs font-medium text-gray-500 uppercase'>Item</div>
						<div className='text-left text-xs font-medium text-gray-500 uppercase'>Qty</div>
						<div className='text-left text-xs font-medium text-gray-500 uppercase'>Rate</div>
						{hasDiscount && <div className='text-center text-xs font-medium text-gray-500 uppercase'>Disc</div>}
						{hasTax && <div className='text-center text-xs font-medium text-gray-500 uppercase'>Tax</div>}
						<div className='text-right text-xs font-medium text-gray-500 uppercase'>Amount</div>
					</div>
					<div className='hidden sm:block border-b border-gray-200'></div>
					<div className={`grid grid-cols-3 ${gridClass} gap-y-1 gap-x-2`}>
						{details.items.map((item, index) => {
							const discountAmount = item.discount && item.discountType === 'percentage'
								? (item.unitPrice * item.quantity * item.discount / 100)
								: (item.discount || 0);
							const taxAmount = item.tax && item.taxType === 'percentage'
								? (item.unitPrice * item.quantity * item.tax / 100)
								: (item.tax || 0);
							return (
								<React.Fragment key={index}>
									<div className='col-span-full sm:col-span-2 border-b border-gray-300'>
										<p className='font-medium text-gray-800'>
											{item.name}
											{item.sku && <span> ({item.sku})</span>}
										</p>
										<p className='text-xs text-gray-600 whitespace-pre-line'>{item.description}</p>
									</div>
									<div className='border-b border-gray-300'>
										<p className='text-gray-800'>{item.quantity}</p>
									</div>
									<div className='border-b border-gray-300'>
										<p className='text-gray-800'>
											{item.unitPrice} {details.currency}
										</p>
									</div>
									{hasDiscount && (
										<div className='border-b border-gray-300 text-center'>
											<p className='text-gray-800 text-sm'>
												{item.discount && item.discount > 0 ? (
													item.discountType === 'percentage'
														? `${item.discount}% (${formatNumberWithCommas(discountAmount)})`
														: `${formatNumberWithCommas(discountAmount)}`
												) : '0'}
											</p>
										</div>
									)}
									{hasTax && (
										<div className='border-b border-gray-300 text-center'>
											<p className='text-gray-800 text-sm'>
												{item.tax && item.tax > 0 ? (
													item.taxType === 'percentage'
														? `${item.tax}% (${formatNumberWithCommas(taxAmount)})`
														: `${formatNumberWithCommas(taxAmount)}`
												) : '0'}
											</p>
										</div>
									)}
									<div className='border-b border-gray-300'>
										<p className='sm:text-right text-gray-800'>
											{item.total} {details.currency}
										</p>
									</div>
								</React.Fragment>
							);
						})}
					</div>
					<div className='sm:hidden border-b border-gray-200'></div>
				</div>
			</div>

			<div className='mt-2 flex sm:justify-end'>
				<div className='sm:text-right space-y-2'>
					<div className='grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2'>
						<dl className='grid sm:grid-cols-5 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Subtotal:</dt>
							<dd className='col-span-2 text-gray-500'>
								{formatNumberWithCommas(Number(details.subTotal))} {details.currency}
							</dd>
						</dl>
						{details.discountDetails?.amount != undefined &&
							details.discountDetails?.amount > 0 && (
								<dl className='grid sm:grid-cols-5 gap-x-3'>
									<dt className='col-span-3 font-semibold text-gray-800'>Discount:</dt>
									<dd className='col-span-2 text-gray-500'>
										{details.discountDetails.amountType === "amount"
											? `- ${details.discountDetails.amount} ${details.currency}`
											: `- ${details.discountDetails.amount}%`}
									</dd>
								</dl>
							)}
						{details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Tax:</dt>
								<dd className='col-span-2 text-gray-500'>
									{details.taxDetails.amountType === "amount"
										? `+ ${details.taxDetails.amount} ${details.currency}`
										: `+ ${details.taxDetails.amount}%`}
								</dd>
							</dl>
						)}
						{details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Shipping:</dt>
								<dd className='col-span-2 text-gray-500'>
									{details.shippingDetails.costType === "amount"
										? `+ ${details.shippingDetails.cost} ${details.currency}`
										: `+ ${details.shippingDetails.cost}%`}
								</dd>
							</dl>
						)}
						<dl className='grid sm:grid-cols-5 gap-x-3'>
							<dt className='col-span-3 font-semibold text-gray-800'>Total:</dt>
							<dd className='col-span-2 text-gray-500'>
								{formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
							</dd>
						</dl>
						{details.totalAmountInWords && (
							<dl className='grid sm:grid-cols-5 gap-x-3'>
								<dt className='col-span-3 font-semibold text-gray-800'>Total in words:</dt>
								<dd className='col-span-2 text-gray-500'>
									<em>
										{details.totalAmountInWords} {details.currency}
									</em>
								</dd>
							</dl>
						)}
					{details.paymentInformation?.isCash && details.paymentInformation?.change && details.paymentInformation.change > 0 && (
						<dl className='grid sm:grid-cols-5 gap-x-3 mt-2'>
							<dt className='col-span-3 text-gray-800'>Change:</dt>
							<dd className='col-span-2 text-gray-500'>
								{formatNumberWithCommas(details.paymentInformation.change)} {details.currency}
							</dd>
						</dl>
					)}
					</div>
				</div>
			</div>

			<div>
				<div className='my-4'>
					<div className='my-2'>
						<p className='font-semibold text-blue-600'>Additional notes:</p>
						<p className='font-regular text-gray-800'>{details.additionalNotes}</p>
					</div>
					<div className='my-2'>
						<p className='font-semibold text-blue-600'>Payment terms:</p>
						<p className='font-regular text-gray-800'>{details.paymentTerms}</p>
					</div>
					<div className='my-2'>
						{details.paymentInformation?.isCash ? (
							<span className='font-semibold text-md text-gray-800'>
								Payment Method: Cash
							</span>
						) : (
							<span className='font-semibold text-md text-gray-800'>
								Please send the payment to this address
								<p className='text-sm'>Bank: {details.paymentInformation?.bankName}</p>
								<p className='text-sm'>Account name: {details.paymentInformation?.accountName}</p>
								<p className='text-sm'>Account no: {details.paymentInformation?.accountNumber}</p>
							</span>
						)}
					</div>
				</div>
				<p className='text-gray-500 text-sm'>
					If you have any questions concerning this invoice, use the following contact information:
				</p>
				<div>
					<p className='block text-sm font-medium text-gray-800'>{sender.email}</p>
					<p className='block text-sm font-medium text-gray-800'>{sender.phone}</p>
				</div>
			</div>

			{/* Signature */}
			{details?.signature?.data && isDataUrl(details?.signature?.data) ? (
				<div className='mt-6'>
					<p className='font-semibold text-gray-800'>Signature:</p>
					<img
						src={details.signature.data}
						width={120}
						height={60}
						alt={`Signature of ${sender.name}`}
					/>
				</div>
			) : details.signature?.data ? (
				<div className='mt-6'>
					<p className='text-gray-800'>Signature:</p>
					<p
						style={{
							fontSize: 30,
							fontWeight: 400,
							fontFamily: `${details.signature.fontFamily}, cursive`,
							color: "black",
						}}
					>
						{details.signature.data}
					</p>
				</div>
			) : null}
		</InvoiceLayout>
	);
};

export default InvoiceTemplate;
