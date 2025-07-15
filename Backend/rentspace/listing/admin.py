from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import (
    Location, Listing, Unit, ListingImage,
    Message, Payment, Review
)

# -------------- Custom Actions ----------------

@admin.action(description='Mark selected listings as verified')
def make_verified(modeladmin, request, queryset):
    queryset.update(is_verified=True)

@admin.action(description='Mark selected listings as unverified')
def make_unverified(modeladmin, request, queryset):
    queryset.update(is_verified=False)

@admin.action(description='Approve selected units')
def approve_units(modeladmin, request, queryset):
    queryset.update(status='approved')

@admin.action(description='Reject selected units')
def reject_units(modeladmin, request, queryset):
    queryset.update(status='rejected')

@admin.action(description='Mark selected messages as read')
def mark_messages_read(modeladmin, request, queryset):
    queryset.update(is_read=True)

# ------------- Custom Filters -----------------

class IsVacantFilter(admin.SimpleListFilter):
    title = _('Is Vacant')
    parameter_name = 'is_vacant'

    def lookups(self, request, model_admin):
        return (
            ('yes', _('Yes')),
            ('no', _('No')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(units__is_occupied=False).distinct()
        elif self.value() == 'no':
            return queryset.exclude(units__is_occupied=False).distinct()
        return queryset

# ---------------- Location --------------------

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('county', 'sub_county', 'ward', 'street_address', 'postal_code', 'created_at')
    search_fields = ('county', 'sub_county', 'ward', 'street_address')
    list_filter = ('county', 'sub_county')
    readonly_fields = ('created_at',)

# ---------------- Listing ---------------------

class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1
    readonly_fields = ('uploaded_at',)


class UnitInline(admin.TabularInline):
    model = Unit
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'landlord', 'property_type', 'is_verified', 'is_vacant', 'created_at', 'avg_rating', 'review_count')
    list_filter = ('is_verified', IsVacantFilter, 'property_type')
    search_fields = ('title', 'description', 'landlord__username')
    actions = [make_verified, make_unverified]
    inlines = [UnitInline, ListingImageInline]
    readonly_fields = ('created_at', 'avg_rating', 'review_count')

    def has_change_permission(self, request, obj=None):
        if not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

    def is_vacant(self, obj):
        return any(not unit.is_occupied for unit in obj.units.all())
    is_vacant.boolean = True
    is_vacant.short_description = 'Vacant'

# ---------------- Unit ------------------------

@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('listing', 'unit_number', 'floor', 'bedrooms', 'bathrooms', 'rent', 'is_occupied', 'status', 'tenant')
    list_filter = ('status', 'is_occupied')
    search_fields = ('unit_number', 'listing__title', 'tenant__username')
    actions = [approve_units, reject_units]
    readonly_fields = ('status',)

# -------------- Listing Image -----------------

@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'thumbnail_preview', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

    def thumbnail_preview(self, obj):
        if obj.property_image:
            return format_html('<img src="{}" width="100" height="60" />', obj.property_image.url)
        return "-"
    thumbnail_preview.short_description = "Preview"

# --------------- Message ----------------------

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'listing', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('sender__username', 'recipient__username', 'listing__title', 'content')
    actions = [mark_messages_read]
    readonly_fields = ('timestamp',)

# ---------------- Payment ---------------------

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'tenant', 'landlord', 'listing', 'amount', 'status', 'payment_method', 'transaction_id', 'paid_at')
    list_filter = ('status', 'payment_method', 'paid_at')
    search_fields = ('tenant__username', 'landlord__username', 'transaction_id', 'listing__title')
    readonly_fields = ('id', 'paid_at')

# ---------------- Review ----------------------

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'listing', 'rating', 'is_verified', 'created_at', 'updated_at')
    list_filter = ('is_verified', 'rating')
    search_fields = ('tenant__username', 'listing__title', 'comment')
    readonly_fields = ('created_at', 'updated_at')
