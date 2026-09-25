"""Initial schema migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-25 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Users Table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Sessions Table
    op.create_table(
        'sessions',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('session_token', sa.String(length=128), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_sessions_session_token', 'sessions', ['session_token'], unique=True)
    op.create_index('ix_sessions_user_id', 'sessions', ['user_id'])

    # Saved Passengers Table
    op.create_table(
        'saved_passengers',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('gender', sa.String(length=20), nullable=False),
        sa.Column('berth_preference', sa.String(length=50), nullable=False, server_default='No Preference'),
        sa.Column('food_preference', sa.String(length=50), nullable=False, server_default='No Food'),
        sa.Column('senior_citizen', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_saved_passengers_user_id', 'saved_passengers', ['user_id'])

    # Bookings Table
    op.create_table(
        'bookings',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('pnr_number', sa.String(length=32), nullable=False),
        sa.Column('idempotency_key', sa.String(length=64), nullable=False),
        sa.Column('train_number', sa.String(length=20), nullable=False),
        sa.Column('train_name', sa.String(length=255), nullable=False),
        sa.Column('origin_code', sa.String(length=10), nullable=False),
        sa.Column('origin_name', sa.String(length=255), nullable=False),
        sa.Column('destination_code', sa.String(length=10), nullable=False),
        sa.Column('destination_name', sa.String(length=255), nullable=False),
        sa.Column('boarding_station_code', sa.String(length=10), nullable=False),
        sa.Column('journey_date', sa.Date(), nullable=False),
        sa.Column('departure_time', sa.String(length=20), nullable=False),
        sa.Column('arrival_time', sa.String(length=20), nullable=False),
        sa.Column('duration', sa.String(length=50), nullable=False),
        sa.Column('arrival_day_offset', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('travel_class', sa.String(length=10), nullable=False),
        sa.Column('quota', sa.String(length=10), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='PENDING_PAYMENT'),
        sa.Column('base_fare', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('reservation_charge', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('superfast_charge', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('tatkal_charge', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('gst_amount', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('total_amount', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('refund_amount', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('contact_email', sa.String(length=255), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=False),
        sa.Column('is_demo', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_bookings_pnr_number', 'bookings', ['pnr_number'], unique=True)
    op.create_index('ix_bookings_idempotency_key', 'bookings', ['idempotency_key'], unique=True)
    op.create_index('ix_bookings_user_id', 'bookings', ['user_id'])
    op.create_index('ix_bookings_status', 'bookings', ['status'])

    # Booking Passengers Table
    op.create_table(
        'booking_passengers',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('booking_id', sa.String(length=36), sa.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('gender', sa.String(length=20), nullable=False),
        sa.Column('berth_preference', sa.String(length=50), nullable=False, server_default='No Preference'),
        sa.Column('assigned_coach', sa.String(length=20), nullable=False, server_default='Pending'),
        sa.Column('assigned_berth', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('assigned_berth_type', sa.String(length=50), nullable=False, server_default='Confirmed'),
        sa.Column('current_status', sa.String(length=30), nullable=False, server_default='CNF'),
        sa.Column('status_detail', sa.String(length=100), nullable=False, server_default='Confirmed'),
    )
    op.create_index('ix_booking_passengers_booking_id', 'booking_passengers', ['booking_id'])

    # Booking Events Table
    op.create_table(
        'booking_events',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('booking_id', sa.String(length=36), sa.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('event_data', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_booking_events_booking_id', 'booking_events', ['booking_id'])

    # Payment Transactions Table
    op.create_table(
        'payment_transactions',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('booking_id', sa.String(length=36), sa.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False, server_default='demo'),
        sa.Column('provider_reference', sa.String(length=100), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False, server_default='INR'),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='SUCCESS'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_payment_transactions_provider_reference', 'payment_transactions', ['provider_reference'], unique=True)
    op.create_index('ix_payment_transactions_booking_id', 'payment_transactions', ['booking_id'])

    # Contact Submissions Table
    op.create_table(
        'contact_submissions',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='RECEIVED'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('contact_submissions')
    op.drop_table('payment_transactions')
    op.drop_table('booking_events')
    op.drop_table('booking_passengers')
    op.drop_table('bookings')
    op.drop_table('saved_passengers')
    op.drop_table('sessions')
    op.drop_table('users')
