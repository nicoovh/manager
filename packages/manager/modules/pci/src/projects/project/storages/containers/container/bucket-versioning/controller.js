export default class PciProjectStorageBucketVersioningController {
  $onInit() {
    this.isBucketVersioningEnabled = false;
  }

  handleBucketVersioningChangee() {
    this.onBucketVersioningChange({
      isBucketVersioningEnabled: this.isBucketVersioningEnabled,
    });
  }

  handleBucketVersioningChange() {
    this.onBucketVersioningChange({
      versioning: this.isBucketVersioningEnabled
        ? { status: 'enabled' }
        : undefined,
    });
  }
}
